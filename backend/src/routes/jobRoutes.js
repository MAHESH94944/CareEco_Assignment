const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

// Create a new job
router.post("/", jobController.createJob);

// Get all jobs
router.get("/", jobController.getAllJobs);

// Get job by ID
router.get("/:id", jobController.getJobById);

// Update job
router.put("/:id", jobController.updateJob);

// Delete job
router.delete("/:id", jobController.deleteJob);

// Get job status
router.get("/:id/status", jobController.getJobStatus);

// Get job execution history
router.get("/:id/history", jobController.getJobHistory);

// Execute job manually
router.post("/:id/execute", jobController.executeJob);

module.exports = router;
