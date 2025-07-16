const mongoose = require("mongoose");

/**
 * Job Schema - Defines the structure for distributed job scheduling
 *
 * Assignment Requirements:
 * - Cron-like schedule (e.g., "every 5 minutes", "daily at 3 AM")
 * - Command to execute (script path, API endpoint, or shell command)
 * - Priority (High, Medium, Low)
 * - Dependency list (other jobs that must complete successfully)
 * - Retry policy (how many times to retry on failure)
 */
const jobSchema = new mongoose.Schema(
  {
    // Job identification and basic info
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },

    // Cron-like schedule - supports standard cron expressions
    schedule: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Basic cron validation - 5 parts separated by spaces
          return /^[*\-,/\d\s]+$/.test(v) && v.split(" ").length === 5;
        },
        message: "Invalid cron expression format",
      },
    },

    // Command to execute - can be script path, API endpoint, or shell command
    command: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // Priority for job execution ordering
    priority: {
      type: String,
      enum: {
        values: ["High", "Medium", "Low"],
        message: "Priority must be High, Medium, or Low",
      },
      default: "Medium",
      index: true,
    },

    // Job dependencies - other jobs that must complete successfully before this job runs
    dependencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        validate: {
          validator: function (v) {
            // Prevent self-dependency
            return !v.equals(this._id);
          },
          message: "Job cannot depend on itself",
        },
      },
    ],

    // Retry policy - number of times to retry on failure
    retryPolicy: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
      validate: {
        validator: Number.isInteger,
        message: "Retry policy must be an integer",
      },
    },

    // Current retries remaining
    retriesLeft: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Current job status
    status: {
      type: String,
      enum: {
        values: ["pending", "running", "success", "failed"],
        message: "Status must be pending, running, success, or failed",
      },
      default: "pending",
      index: true,
    },

    // Scheduling timestamps
    lastRun: {
      type: Date,
      index: true,
    },
    nextRun: {
      type: Date,
      index: true,
    },

    // Execution statistics
    totalRuns: {
      type: Number,
      default: 0,
      min: 0,
    },
    successfulRuns: {
      type: Number,
      default: 0,
      min: 0,
    },
    failedRuns: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Detailed execution history
    executions: [
      {
        startTime: { type: Date, required: true },
        endTime: { type: Date },
        status: {
          type: String,
          enum: ["running", "success", "failed"],
          required: true,
        },
        output: {
          type: String,
          maxlength: 5000, // Limit output size
        },
        workerId: {
          type: String,
        }, // Track which worker executed the job
        duration: {
          type: Number,
        }, // Execution duration in milliseconds
      },
    ],

    // Additional metadata
    createdBy: {
      type: String,
      default: "system",
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },

    // Job configuration metadata
    metadata: {
      timeout: {
        type: Number,
        default: 300000, // 5 minutes default timeout
      },
      maxExecutionTime: {
        type: Number,
        default: 3600000, // 1 hour max execution time
      },
    },
  },
  {
    timestamps: true,
    collection: "jobs",
  }
);

// Indexes for better query performance
jobSchema.index({ status: 1, nextRun: 1 }); // For scheduler queries
jobSchema.index({ dependencies: 1 }); // For dependency checking
jobSchema.index({ name: 1 }, { unique: true }); // Ensure unique job names

// Pre-save middleware to set retriesLeft when retryPolicy changes
jobSchema.pre("save", function (next) {
  if (this.isModified("retryPolicy")) {
    this.retriesLeft = this.retryPolicy;
  }
  this.lastModified = new Date();
  next();
});

// Virtual for success rate calculation
jobSchema.virtual("successRate").get(function () {
  if (this.totalRuns === 0) return 0;
  return ((this.successfulRuns / this.totalRuns) * 100).toFixed(2);
});

// Virtual for average execution time
jobSchema.virtual("avgExecutionTime").get(function () {
  if (!this.executions || this.executions.length === 0) return 0;
  const completedExecutions = this.executions.filter((exec) => exec.duration);
  if (completedExecutions.length === 0) return 0;
  const totalDuration = completedExecutions.reduce(
    (sum, exec) => sum + exec.duration,
    0
  );
  return Math.round(totalDuration / completedExecutions.length);
});

// Method to check if job can run (dependencies met)
jobSchema.methods.canRun = async function () {
  if (!this.dependencies || this.dependencies.length === 0) {
    return true;
  }

  const Job = this.constructor;
  const dependencies = await Job.find({ _id: { $in: this.dependencies } });
  return dependencies.every((dep) => dep.status === "success");
};

// Method to get next execution time
jobSchema.methods.getNextExecution = function () {
  return this.nextRun || new Date();
};

// Static method to find jobs ready for execution
jobSchema.statics.findReadyJobs = function () {
  return this.find({
    status: "pending",
    nextRun: { $lte: new Date() },
  }).sort({ priority: 1, nextRun: 1 });
};

// Static method to find jobs by dependency
jobSchema.statics.findByDependency = function (jobId) {
  return this.find({ dependencies: jobId });
};

module.exports = mongoose.model("Job", jobSchema);
