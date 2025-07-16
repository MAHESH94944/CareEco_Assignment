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

    // Validate dependencies exist
    if (dependencies && dependencies.length > 0) {
      const dependentJobs = await Job.find({ _id: { $in: dependencies } });
      if (dependentJobs.length !== dependencies.length) {
        return res
          .status(400)
          .json({ error: "One or more dependencies not found" });
      }
    }

    const job = new Job({
      name,
      schedule,
      command,
      priority: priority || "Medium",
      dependencies: dependencies || [],
      retryPolicy: retryPolicy || 0,
      retriesLeft: retryPolicy || 0,
      nextRun: calculateNextRun(schedule),
      status: "pending",
    });

    await job.save();
    res.status(201).json({
      message: "Job created successfully",
      job: job,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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
