const express = require("express");
const router = express.Router();
const workerController = require("../controllers/workerController");

// Get all workers
router.get("/", workerController.getAllWorkers);

// Get worker by ID
router.get("/:id", workerController.getWorkerStatus);

// Get cluster statistics
router.get("/stats", workerController.getClusterStats);

// Get workers by capability
router.get("/capability/:type", workerController.getWorkersByCapability);

// Assign job to worker
router.post("/assign", workerController.assignJobToWorker);

// Release worker
router.post("/:id/release", workerController.releaseWorker);

// DEBUG: Reset all workers to idle (for testing)
router.post("/debug/reset", workerController.resetWorkers);

module.exports = router;
