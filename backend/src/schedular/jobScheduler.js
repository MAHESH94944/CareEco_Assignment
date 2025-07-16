const cron = require("node-cron");
const Job = require("../models/Job");
const { executeCommand } = require("../utils/commands");
const { calculateNextRun } = require("../utils/cronHelper");
const { workerManager } = require("../controllers/workerController");

async function runJob(job, workerId) {
  const execution = {
    startTime: new Date(),
    status: "running",
    output: "",
  };

  try {
    console.log(`Starting job ${job.name} on worker ${workerId}`);

    job.status = "running";
    job.lastRun = new Date();
    await job.save();

    // Execute the command
    const result = await executeCommand(job.command);

    job.status = "success";
    job.nextRun = calculateNextRun(job.schedule);
    job.successfulRuns = (job.successfulRuns || 0) + 1;
    job.totalRuns = (job.totalRuns || 0) + 1;

    // Update execution record
    execution.endTime = new Date();
    execution.status = "success";
    execution.output = JSON.stringify(result);
    job.executions = job.executions || [];
    job.executions.push(execution);

    await job.save();

    console.log(`Job ${job.name} completed successfully`);
  } catch (err) {
    console.error(`Job ${job.name} failed:`, err.message);

    job.retriesLeft -= 1;
    job.totalRuns = (job.totalRuns || 0) + 1;
    job.failedRuns = (job.failedRuns || 0) + 1;

    // Update execution record
    execution.endTime = new Date();
    execution.status = "failed";
    execution.output = err.message;
    job.executions = job.executions || [];
    job.executions.push(execution);

    if (job.retriesLeft <= 0) {
      job.status = "failed";
      console.log(`Job ${job.name} failed permanently after all retries`);
    } else {
      job.status = "pending";
      // Retry after 1 minute
      job.nextRun = new Date(Date.now() + 60 * 1000);
      console.log(
        `Job ${job.name} will retry in 1 minute. Retries left: ${job.retriesLeft}`
      );
    }

    await job.save();
  } finally {
    // Release the worker
    workerManager.releaseWorker(workerId);
  }
}

async function checkDependencies(job) {
  if (!job.dependencies || job.dependencies.length === 0) {
    return { canRun: true, reason: "No dependencies" };
  }

  const dependencies = await Job.find({ _id: { $in: job.dependencies } });
  const failedDependencies = dependencies.filter(
    (dep) => dep.status !== "success"
  );

  if (failedDependencies.length > 0) {
    const failedNames = failedDependencies.map(
      (dep) => `${dep.name} (${dep.status})`
    );
    return {
      canRun: false,
      reason: `Waiting for dependencies: ${failedNames.join(", ")}`,
    };
  }

  return { canRun: true, reason: "All dependencies met" };
}

async function processJobs() {
  try {
    // Get pending jobs ready for execution
    const jobs = await Job.find({
      status: { $in: ["pending"] },
      nextRun: { $lte: new Date() },
    })
      .populate("dependencies", "name status")
      .sort({
        priority: 1,
      });

    // Custom priority sorting
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    jobs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    for (const job of jobs) {
      const dependencyCheck = await checkDependencies(job);

      if (dependencyCheck.canRun) {
        // Detect job type and find compatible worker
        const jobType = workerManager.detectJobType(job.command);
        const availableWorker = workerManager.getCompatibleWorker(jobType);

        if (availableWorker) {
          const assignmentResult = workerManager.assignJob(
            availableWorker.id,
            job._id,
            job.command
          );

          if (assignmentResult.success) {
            console.log(
              `Job ${job.name} (${jobType}) assigned to worker ${availableWorker.id}`
            );

            // Run job asynchronously
            runJob(job, availableWorker.id).catch((err) => {
              console.error(`Error running job ${job.name}:`, err);
            });
          } else {
            console.error(
              `Failed to assign job ${job.name}: ${assignmentResult.error}`
            );
          }
        } else {
          console.log(
            `No available workers for job ${job.name} (requires ${jobType} capability)`
          );

          // Log available workers for debugging
          const compatibleWorkers =
            workerManager.getCompatibleWorkerIds(jobType);
          if (compatibleWorkers.length === 0) {
            console.log(`No workers support ${jobType} capability`);
          } else {
            console.log(
              `Workers with ${jobType} capability: ${compatibleWorkers.join(
                ", "
              )} (all busy)`
            );
          }
        }
      } else {
        console.log(`Job ${job.name}: ${dependencyCheck.reason}`);
      }
    }
  } catch (error) {
    console.error("Error processing jobs:", error);
  }
}

function startScheduler() {
  console.log("Starting job scheduler...");

  // Process jobs every minute
  cron.schedule("* * * * *", processJobs);

  // Update worker health every 30 seconds
  cron.schedule("*/30 * * * * *", () => {
    workerManager.updateWorkerHealth();
  });

  console.log("Job scheduler started successfully");
}

module.exports = { startScheduler };
