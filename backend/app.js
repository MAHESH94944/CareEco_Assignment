const express = require("express");
const cors = require("cors");
const jobRoutes = require("./src/routes/jobRoutes");
const workerRoutes = require("./src/routes/workerRoutes");
const { startScheduler } = require("./src/schedular/jobScheduler");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
