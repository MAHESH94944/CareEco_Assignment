const express = require("express");
const router = express.Router();
const workerController = require("../controllers/workerController");

// Get all workers with cluster information
router.get("/", workerController.getAllWorkers);

// Get comprehensive cluster statistics
router.get("/stats", workerController.getClusterStats);

// Get workers by specific capability
router.get("/capability/:type", workerController.getWorkersByCapability);

// Get specific worker status
router.get("/:id", workerController.getWorkerStatus);

// Manually assign job to worker
router.post("/assign", workerController.assignJobToWorker);

// Release worker from current job
router.post("/:id/release", workerController.releaseWorker);

module.exports = router;
