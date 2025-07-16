const Job = require("../models/Job");
const { executeCommand } = require("../utils/commands");
const {
  calculateNextRun,
  isValidCronExpression,
} = require("../utils/cronHelper");

exports.createJob = async (req, res) => {
  try {
    const { name, schedule, command, priority, dependencies, retryPolicy } =
      req.body;

    // Validate required fields
    if (!name || !schedule || !command) {
      return res
        .status(400)
        .json({ error: "Name, schedule, and command are required" });
    }

    // Validate cron expression
    if (!isValidCronExpression(schedule)) {
      return res.status(400).json({ error: "Invalid cron expression" });
    }

    // Validate and process dependencies
    let processedDependencies = [];
    if (dependencies && dependencies.length > 0) {
      // Filter out empty strings and invalid IDs
      const validDependencies = dependencies.filter(
        (dep) => dep && dep.trim() !== ""
      );

      if (validDependencies.length > 0) {
        const dependentJobs = await Job.find({
          _id: { $in: validDependencies },
        });
        if (dependentJobs.length !== validDependencies.length) {
          return res.status(400).json({
            error: "One or more dependencies not found",
            requestedDependencies: validDependencies.length,
            foundDependencies: dependentJobs.length,
          });
        }

        // Check for circular dependencies
        const circularCheck = await checkCircularDependencies(
          validDependencies,
          name
        );
        if (circularCheck.hasCircular) {
          return res.status(400).json({
            error: "Circular dependency detected",
            circularPath: circularCheck.path,
          });
        }

        processedDependencies = validDependencies;
      }
    }

    const job = new Job({
      name,
      schedule,
      command,
      priority: priority || "Medium",
      dependencies: processedDependencies,
      retryPolicy: retryPolicy || 0,
      retriesLeft: retryPolicy || 0,
      nextRun: calculateNextRun(schedule),
      status: "pending",
    });

    await job.save();

    // Populate dependencies for response
    await job.populate("dependencies", "name status");

    res.status(201).json({
      message: "Job created successfully",
      job: job,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Helper function to check for circular dependencies
async function checkCircularDependencies(
  dependencies,
  jobName,
  visited = new Set()
) {
  if (visited.has(jobName)) {
    return {
      hasCircular: true,
      path: Array.from(visited).join(" -> ") + " -> " + jobName,
    };
  }

  visited.add(jobName);

  const dependentJobs = await Job.find({ _id: { $in: dependencies } });
  for (const depJob of dependentJobs) {
    if (depJob.dependencies && depJob.dependencies.length > 0) {
      const result = await checkCircularDependencies(
        depJob.dependencies.map((id) => id.toString()),
        depJob.name,
        new Set(visited)
      );
      if (result.hasCircular) {
        return result;
      }
    }
  }

  return { hasCircular: false };
}

exports.getAllJobs = async (req, res) => {
  try {
    const { status, priority } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const jobs = await Job.find(filter).populate("dependencies", "name status");
    res.json({
      count: jobs.length,
      jobs: jobs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "dependencies",
      "name status"
    );
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { schedule, dependencies } = req.body;

    // Validate cron expression if provided
    if (schedule && !isValidCronExpression(schedule)) {
      return res.status(400).json({ error: "Invalid cron expression" });
    }

    // Validate dependencies if provided
    if (dependencies && dependencies.length > 0) {
      const dependentJobs = await Job.find({ _id: { $in: dependencies } });
      if (dependentJobs.length !== dependencies.length) {
        return res
          .status(400)
          .json({ error: "One or more dependencies not found" });
      }
    }

    // Update nextRun if schedule changed
    if (schedule) {
      req.body.nextRun = calculateNextRun(schedule);
    }

    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("dependencies", "name status");

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      message: "Job updated successfully",
      job: job,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if other jobs depend on this job
    const dependentJobs = await Job.find({ dependencies: req.params.id });
    if (dependentJobs.length > 0) {
      return res.status(400).json({
        error: "Cannot delete job with existing dependencies",
        dependentJobs: dependentJobs.map((j) => j.name),
      });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json({
      id: job._id,
      name: job.name,
      status: job.status,
      lastRun: job.lastRun,
      nextRun: job.nextRun,
      retriesLeft: job.retriesLeft,
      totalRuns: job.totalRuns || 0,
      successfulRuns: job.successfulRuns || 0,
      failedRuns: job.failedRuns || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobHistory = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json({
      jobId: job._id,
      name: job.name,
      executions: job.executions || [],
      totalRuns: job.totalRuns || 0,
      successfulRuns: job.successfulRuns || 0,
      failedRuns: job.failedRuns || 0,
      successRate:
        job.totalRuns > 0
          ? (((job.successfulRuns || 0) / job.totalRuns) * 100).toFixed(2) + "%"
          : "0%",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Additional method for manual job execution
exports.executeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.status === "running") {
      return res.status(400).json({ error: "Job is already running" });
    }

    // This would trigger the job scheduler to pick up this job
    job.nextRun = new Date();
    job.status = "pending";
    await job.save();

    res.json({ message: "Job queued for execution" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
