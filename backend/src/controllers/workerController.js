// Worker management system for distributed job execution
class WorkerManager {
  constructor() {
    this.workers = [
      // General purpose workers (script + api + shell)
      {
        id: "worker-1",
        status: "idle",
        currentJob: null,
        lastPing: new Date(),
        lastOnline: new Date(),
        host: "server-1.cluster.local",
        port: 8001,
        capabilities: ["script", "api", "shell"],
        jobsCompleted: 0,
        jobsFailed: 0,
        consecutiveFailures: 0,
      },
      {
        id: "worker-2",
        status: "idle",
        currentJob: null,
        lastPing: new Date(),
        lastOnline: new Date(),
        host: "server-2.cluster.local",
        port: 8002,
        capabilities: ["script", "api", "shell"],
        jobsCompleted: 0,
        jobsFailed: 0,
        consecutiveFailures: 0,
      },

      // Script specialists
      {
        id: "worker-3",
        status: "idle",
        currentJob: null,
        lastPing: new Date(),
        lastOnline: new Date(),
        host: "script-1.cluster.local",
        port: 8003,
        capabilities: ["script"],
        jobsCompleted: 0,
        jobsFailed: 0,
        consecutiveFailures: 0,
      },
      {
        id: "worker-4",
        status: "idle",
        currentJob: null,
        lastPing: new Date(),
        lastOnline: new Date(),
        host: "script-2.cluster.local",
        port: 8004,
        capabilities: ["script"],
        jobsCompleted: 0,
        jobsFailed: 0,
        consecutiveFailures: 0,
      },

      // API specialists
      {
        id: "worker-5",
        status: "idle",
        currentJob: null,
        lastPing: new Date(),
        lastOnline: new Date(),
        host: "api-1.cluster.local",
        port: 8005,
        capabilities: ["api"],
        jobsCompleted: 0,
        jobsFailed: 0,
        consecutiveFailures: 0,
      },
      {
        id: "worker-6",
        status: "idle",
        currentJob: null,
        lastPing: new Date(),
        lastOnline: new Date(),
        host: "api-2.cluster.local",
        port: 8006,
        capabilities: ["api"],
        jobsCompleted: 0,
        jobsFailed: 0,
        consecutiveFailures: 0,
      },

      // Shell specialists
      {
        id: "worker-7",
        status: "idle",
        currentJob: null,
        lastPing: new Date(),
        lastOnline: new Date(),
        host: "shell-1.cluster.local",
        port: 8007,
        capabilities: ["shell"],
        jobsCompleted: 0,
        jobsFailed: 0,
        consecutiveFailures: 0,
      },
      {
        id: "worker-8",
        status: "idle",
        currentJob: null,
        lastPing: new Date(),
        lastOnline: new Date(),
        host: "shell-2.cluster.local",
        port: 8008,
        capabilities: ["shell"],
        jobsCompleted: 0,
        jobsFailed: 0,
        consecutiveFailures: 0,
      },

      // Mixed capability workers
      {
        id: "worker-9",
        status: "idle",
        currentJob: null,
        lastPing: new Date(),
        lastOnline: new Date(),
        host: "mixed-1.cluster.local",
        port: 8009,
        capabilities: ["script", "api"],
        jobsCompleted: 0,
        jobsFailed: 0,
        consecutiveFailures: 0,
      },
      {
        id: "worker-10",
        status: "idle",
        currentJob: null,
        lastPing: new Date(),
        lastOnline: new Date(),
        host: "mixed-2.cluster.local",
        port: 8010,
        capabilities: ["api", "shell"],
        jobsCompleted: 0,
        jobsFailed: 0,
        consecutiveFailures: 0,
      },

      // Test workers - Only these will be offline/busy initially
      {
        id: "worker-11",
        status: "offline", // Initially offline for testing
        currentJob: null,
        lastPing: new Date(Date.now() - 3600000), // 1 hour ago
        lastOnline: new Date(Date.now() - 3600000),
        host: "offline-1.cluster.local",
        port: 8011,
        capabilities: ["script", "api", "shell"],
        jobsCompleted: 0,
        jobsFailed: 0,
        consecutiveFailures: 0,
      },
      {
        id: "worker-12",
        status: "busy", // Initially busy for testing
        currentJob: "test-job-123",
        lastPing: new Date(),
        lastOnline: new Date(),
        host: "busy-1.cluster.local",
        port: 8012,
        capabilities: ["script", "shell"],
        jobsCompleted: 0,
        jobsFailed: 0,
        consecutiveFailures: 0,
      },
    ];
    this.workerTimeout = 300000; // 5 minutes
    console.log(
      "WorkerManager initialized with",
      this.workers.length,
      "workers"
    );
    this.logWorkerStatus();
  }

  // Add debugging method
  logWorkerStatus() {
    console.log("\n=== Worker Status Summary ===");
    this.workers.forEach((worker) => {
      console.log(
        `${worker.id}: ${worker.status} (${worker.capabilities.join(", ")})`
      );
    });
    console.log("===============================\n");
  }

  detectJobType(command) {
    if (command.startsWith("script:")) {
      return "script";
    } else if (
      command.startsWith("http://") ||
      command.startsWith("https://")
    ) {
      return "api";
    }
    return "shell";
  }

  getCompatibleWorker(requiredCapability) {
    console.log(
      `\n🔍 Looking for workers with capability: ${requiredCapability}`
    );

    // Don't update health here - let's be explicit about when we do it
    // this.updateWorkerHealth();

    const compatibleWorkers = this.workers.filter((worker) =>
      worker.capabilities.includes(requiredCapability)
    );

    console.log(
      `Found ${compatibleWorkers.length} compatible workers:`,
      compatibleWorkers.map((w) => `${w.id}(${w.status})`).join(", ")
    );

    const availableWorkers = compatibleWorkers.filter(
      (worker) => worker.status === "idle"
    );

    console.log(`Available workers: ${availableWorkers.length}`);

    if (availableWorkers.length === 0) {
      console.log(
        `❌ No available workers with capability: ${requiredCapability}`
      );
      console.log(
        "Compatible workers status:",
        compatibleWorkers.map(
          (w) =>
            `${w.id}: ${w.status} (last ping: ${new Date(
              w.lastPing
            ).toLocaleTimeString()})`
        )
      );
      return null;
    }

    const selectedWorker = availableWorkers.reduce((prev, current) => {
      if (prev.consecutiveFailures !== current.consecutiveFailures) {
        return prev.consecutiveFailures < current.consecutiveFailures
          ? prev
          : current;
      }
      return prev.jobsCompleted < current.jobsCompleted ? prev : current;
    });

    console.log(
      `✅ Selected worker ${selectedWorker.id} for capability: ${requiredCapability}`
    );
    return selectedWorker;
  }

  getAvailableWorker() {
    this.updateWorkerHealth();

    const availableWorkers = this.workers.filter(
      (worker) => worker.status === "idle"
    );

    if (availableWorkers.length === 0) return null;

    return availableWorkers.reduce((prev, current) => {
      if (prev.consecutiveFailures !== current.consecutiveFailures) {
        return prev.consecutiveFailures < current.consecutiveFailures
          ? prev
          : current;
      }
      return prev.jobsCompleted < current.jobsCompleted ? prev : current;
    });
  }

  assignJob(workerId, jobId, command = null) {
    console.log(`\n🎯 Attempting to assign job ${jobId} to worker ${workerId}`);

    // Update worker health before assignment
    this.updateWorkerHealth();

    const worker = this.workers.find((w) => w.id === workerId);

    if (!worker) {
      const error = `Worker ${workerId} not found`;
      console.error("❌", error);
      return {
        success: false,
        error,
        workerStatus: null,
        clusterStatus: this.getClusterHealthSummary(),
      };
    }

    console.log(`Worker ${workerId} current status: ${worker.status}`);

    if (worker.status !== "idle") {
      const error = `Worker ${workerId} is not available (status: ${worker.status})`;
      console.error("❌", error);
      return {
        success: false,
        error,
        workerStatus: this.getWorkerStatus(workerId),
        clusterStatus: this.getClusterHealthSummary(),
      };
    }

    if (command) {
      const requiredCapability = this.detectJobType(command);
      console.log(`Job requires capability: ${requiredCapability}`);
      console.log(`Worker capabilities: ${worker.capabilities.join(", ")}`);

      if (!worker.capabilities.includes(requiredCapability)) {
        const compatibleWorkers =
          this.getCompatibleWorkerIds(requiredCapability);
        const availableCompatibleWorkers = compatibleWorkers.filter((id) => {
          const w = this.workers.find((worker) => worker.id === id);
          return w && w.status === "idle";
        });

        const error = `Worker ${workerId} doesn't support '${requiredCapability}' commands`;
        console.error("❌", error);
        return {
          success: false,
          error,
          compatibleWorkers,
          availableCompatibleWorkers,
          workerStatus: this.getWorkerStatus(workerId),
          clusterStatus: this.getClusterHealthSummary(),
          suggestions:
            availableCompatibleWorkers.length > 0
              ? `Try assigning to: ${availableCompatibleWorkers.join(", ")}`
              : "No compatible workers currently available",
        };
      }
    }

    // Assignment successful
    worker.status = "busy";
    worker.currentJob = jobId;
    worker.lastPing = new Date();
    worker.lastOnline = new Date();

    const message = `Job ${jobId} assigned to worker ${workerId}`;
    console.log("✅", message);
    return {
      success: true,
      message,
      workerStatus: this.getWorkerStatus(workerId),
    };
  }

  getCompatibleWorkerIds(capability) {
    return this.workers
      .filter((worker) => worker.capabilities.includes(capability))
      .map((worker) => worker.id);
  }

  getClusterHealthSummary() {
    const stats = this.getClusterStats();
    return {
      totalWorkers: stats.totalWorkers,
      activeWorkers: stats.activeWorkers,
      idleWorkers: stats.idleWorkers,
      busyWorkers: stats.busyWorkers,
      offlineWorkers: stats.offlineWorkers,
      capabilityStats: stats.capabilityStats,
    };
  }

  releaseWorker(workerId, jobSuccess = true) {
    const worker = this.workers.find((w) => w.id === workerId);
    if (!worker) return false;

    worker.status = "idle";
    worker.currentJob = null;
    worker.lastPing = new Date();
    worker.lastOnline = new Date();

    if (jobSuccess) {
      worker.jobsCompleted++;
      worker.consecutiveFailures = 0;
    } else {
      worker.jobsFailed++;
      worker.consecutiveFailures++;
    }

    console.log(`Worker ${workerId} released. Status: ${worker.status}`);
    return true;
  }

  getAllWorkers() {
    return this.workers.map((worker) => ({
      id: worker.id,
      status: worker.status,
      currentJob: worker.currentJob,
      capabilities: worker.capabilities,
      uptime: this.calculateUptime(worker.lastOnline),
      loadPercentage: this.calculateLoadPercentage(worker),
      healthStatus: this.getWorkerHealthStatus(worker),
    }));
  }

  getWorkerStatus(workerId) {
    const worker = this.workers.find((w) => w.id === workerId);
    if (!worker) return null;

    return {
      id: worker.id,
      status: worker.status,
      currentJob: worker.currentJob,
      capabilities: worker.capabilities,
      uptime: this.calculateUptime(worker.lastOnline),
      loadPercentage: this.calculateLoadPercentage(worker),
      healthStatus: this.getWorkerHealthStatus(worker),
    };
  }

  getWorkerHealthStatus(worker) {
    const now = new Date();
    const timeSinceLastPing = now - worker.lastPing;

    let status = "healthy";
    let message = "Operating normally";

    if (worker.status === "offline") {
      status = "offline";
      message = "Worker offline";
    } else if (timeSinceLastPing > 120000) {
      status = "unresponsive";
      message = "No recent pings";
    } else if (worker.consecutiveFailures >= 3) {
      status = "degraded";
      message = "Multiple consecutive failures";
    }

    return {
      status,
      message,
      lastPing: worker.lastPing,
      consecutiveFailures: worker.consecutiveFailures,
    };
  }

  calculateUptime(lastOnline) {
    const now = new Date();
    const uptimeMs = now - lastOnline;
    const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  calculateLoadPercentage(worker) {
    if (worker.status === "busy") return 100;
    if (worker.status === "offline") return 0;

    const baseLoad = Math.min(
      Math.floor((worker.jobsCompleted + worker.jobsFailed) / 10) * 10,
      80
    );
    return Math.min(baseLoad + worker.consecutiveFailures * 5, 90);
  }

  updateWorkerHealth() {
    const now = new Date();
    let updatedWorkers = 0;

    this.workers.forEach((worker) => {
      const timeSinceLastPing = now - worker.lastPing;
      const oldStatus = worker.status;

      // Don't mark busy workers as offline
      if (timeSinceLastPing > this.workerTimeout && worker.status !== "busy") {
        if (worker.status !== "offline") {
          console.log(
            `⚠️  Marking worker ${worker.id} as offline (last ping: ${new Date(
              worker.lastPing
            ).toLocaleTimeString()})`
          );
          updatedWorkers++;
        }
        worker.status = "offline";
      } else if (worker.status === "offline" && timeSinceLastPing < 30000) {
        console.log(`✅ Worker ${worker.id} back online`);
        worker.status = "idle";
        worker.lastOnline = now;
        updatedWorkers++;
      }
    });

    if (updatedWorkers > 0) {
      console.log(`Updated ${updatedWorkers} worker statuses`);
      this.logWorkerStatus();
    }
  }

  // Add method to manually reset all workers to idle (for testing)
  resetAllWorkersToIdle() {
    console.log("🔄 Resetting all workers to idle status");
    this.workers.forEach((worker) => {
      if (worker.id !== "worker-11") {
        // Keep worker-11 offline for testing
        worker.status = "idle";
        worker.currentJob = null;
        worker.lastPing = new Date();
        worker.lastOnline = new Date();
      }
    });
    this.logWorkerStatus();
  }

  // Enhanced cluster stats with more debugging info
  getClusterStats() {
    const totalWorkers = this.workers.length;
    const activeWorkers = this.workers.filter(
      (w) => w.status !== "offline"
    ).length;
    const busyWorkers = this.workers.filter((w) => w.status === "busy").length;
    const idleWorkers = this.workers.filter((w) => w.status === "idle").length;
    const offlineWorkers = this.workers.filter(
      (w) => w.status === "offline"
    ).length;

    return {
      totalWorkers,
      activeWorkers,
      busyWorkers,
      idleWorkers,
      offlineWorkers,
      capabilityStats: {
        script: this.getCompatibleWorkerIds("script").length,
        api: this.getCompatibleWorkerIds("api").length,
        shell: this.getCompatibleWorkerIds("shell").length,
      },
      workerStatusBreakdown: {
        idle: this.workers.filter((w) => w.status === "idle").map((w) => w.id),
        busy: this.workers.filter((w) => w.status === "busy").map((w) => w.id),
        offline: this.workers
          .filter((w) => w.status === "offline")
          .map((w) => w.id),
      },
    };
  }
}

const workerManager = new WorkerManager();

// Export controller methods
module.exports = {
  workerManager,

  // Add debug endpoint
  resetWorkers: (req, res) => {
    workerManager.resetAllWorkersToIdle();
    res.json({
      message: "All workers reset to idle",
      workers: workerManager.getAllWorkers(),
      clusterStats: workerManager.getClusterStats(),
    });
  },

  getAllWorkers: (req, res) => {
    workerManager.updateWorkerHealth();
    const stats = workerManager.getClusterStats();

    console.log(
      "\n📊 Current Cluster Status:\n" +
        `Total: ${stats.totalWorkers}, Active: ${stats.activeWorkers}, Idle: ${stats.idleWorkers}, Busy: ${stats.busyWorkers}, Offline: ${stats.offlineWorkers}`
    );
    console.log("Idle workers:", stats.workerStatusBreakdown.idle.join(", "));
    console.log("Busy workers:", stats.workerStatusBreakdown.busy.join(", "));
    console.log(
      "Offline workers:",
      stats.workerStatusBreakdown.offline.join(", ")
    );

    res.json({
      workers: workerManager.getAllWorkers(),
      clusterStats: stats,
    });
  },

  getWorkerStatus: (req, res) => {
    const worker = workerManager.getWorkerStatus(req.params.id);
    if (!worker) {
      return res.status(404).json({
        error: "Worker not found",
        availableWorkers: workerManager.workers.map((w) => w.id),
      });
    }
    res.json(worker);
  },

  assignJobToWorker: async (req, res) => {
    const { workerId, jobId } = req.body;

    if (!workerId || !jobId) {
      return res.status(400).json({
        error: "Worker ID and Job ID are required",
        clusterStatus: workerManager.getClusterHealthSummary(),
      });
    }

    try {
      const Job = require("../models/Job");
      const job = await Job.findById(jobId);

      if (!job) {
        return res.status(404).json({
          error: "Job not found",
          clusterStatus: workerManager.getClusterHealthSummary(),
        });
      }

      const result = workerManager.assignJob(workerId, jobId, job.command);

      if (result.success) {
        res.json({
          message: result.message,
          worker: result.workerStatus,
          jobType: workerManager.detectJobType(job.command),
        });
      } else {
        res.status(400).json({
          error: result.error,
          compatibleWorkers: result.compatibleWorkers || [],
          availableCompatibleWorkers: result.availableCompatibleWorkers || [],
          clusterStatus: result.clusterStatus,
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
        clusterStatus: workerManager.getClusterHealthSummary(),
      });
    }
  },

  releaseWorker: (req, res) => {
    const { jobSuccess } = req.body;
    const success = workerManager.releaseWorker(
      req.params.id,
      jobSuccess !== false
    );

    if (success) {
      res.json({
        message: "Worker released successfully",
        worker: workerManager.getWorkerStatus(req.params.id),
      });
    } else {
      res.status(400).json({
        error: "Failed to release worker",
        clusterStatus: workerManager.getClusterHealthSummary(),
      });
    }
  },

  getClusterStats: (req, res) => {
    workerManager.updateWorkerHealth();
    res.json(workerManager.getClusterStats());
  },

  getWorkersByCapability: (req, res) => {
    const capability = req.params.type;
    if (!["script", "api", "shell"].includes(capability)) {
      return res.status(400).json({ error: "Invalid capability type" });
    }

    workerManager.updateWorkerHealth();
    const compatibleWorkers = workerManager
      .getAllWorkers()
      .filter((worker) => worker.capabilities.includes(capability));

    res.json({
      capability,
      workers: compatibleWorkers,
      count: compatibleWorkers.length,
      available: compatibleWorkers.filter((w) => w.status === "idle").length,
    });
  },
};
