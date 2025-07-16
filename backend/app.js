const express = require("express");
const jobRoutes = require("./src/routes/jobRoutes");
const workerRoutes = require("./src/routes/workerRoutes");
const { startScheduler } = require("./src/schedular/jobScheduler");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/workers", workerRoutes);

// Start scheduler
startScheduler();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
