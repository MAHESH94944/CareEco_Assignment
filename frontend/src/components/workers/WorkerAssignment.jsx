import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { workersApi, jobsApi } from "../../services/api";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../shared/LoadingSpinner";

const WorkerAssignment = React.memo(() => {
  const [workers, setWorkers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // Memoize fetch data function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [workersResponse, jobsResponse] = await Promise.all([
        workersApi.getWorkers(),
        jobsApi.getJobs({ status: "pending" }),
      ]);
      setWorkers(workersResponse.workers || []);
      setJobs(jobsResponse.jobs || []);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize assign job handler
  const handleAssignJob = useCallback(async () => {
    if (!selectedWorker || !selectedJob) {
      toast.error("Please select both worker and job");
      return;
    }

    setAssigning(true);
    try {
      await workersApi.assignJob(selectedWorker, selectedJob);
      toast.success("Job assigned successfully");
      setSelectedWorker("");
      setSelectedJob("");
      fetchData(); // Refresh data
    } catch (error) {
      toast.error("Failed to assign job: " + error.message);
    } finally {
      setAssigning(false);
    }
  }, [selectedWorker, selectedJob, fetchData]);

  // Memoize helper functions
  const getJobTypeColor = useCallback((command) => {
    if (command.startsWith("script:")) return "text-purple-600";
    if (command.startsWith("http")) return "text-blue-600";
    return "text-green-600";
  }, []);

  const getJobType = useCallback((command) => {
    if (command.startsWith("script:")) return "Script";
    if (command.startsWith("http")) return "API";
    return "Shell";
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const availableWorkers = workers.filter((worker) => worker.status === "idle");
  const pendingJobs = jobs.filter((job) => job.status === "pending");

  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>Worker Assignment - Job Scheduler</title>
        <meta
          name="description"
          content="Manually assign jobs to workers with capability-based matching."
        />
      </Helmet>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Manual Job Assignment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Worker Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Worker
            </label>
            <select
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a worker...</option>
              {availableWorkers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.id} - {worker.capabilities.join(", ")}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {availableWorkers.length} available workers
            </p>
          </div>

          {/* Job Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Job
            </label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a job...</option>
              {pendingJobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.name} ({getJobType(job.command)}) - {job.priority}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {pendingJobs.length} pending jobs
            </p>
          </div>
        </div>

        {/* Assignment Details */}
        {selectedWorker && selectedJob && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Assignment Preview
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Worker:</span> {selectedWorker}
                <br />
                <span className="font-medium">Capabilities:</span>{" "}
                {workers
                  .find((w) => w.id === selectedWorker)
                  ?.capabilities.join(", ")}
              </div>
              <div>
                <span className="font-medium">Job:</span>{" "}
                {jobs.find((j) => j._id === selectedJob)?.name}
                <br />
                <span className="font-medium">Type:</span>{" "}
                <span
                  className={getJobTypeColor(
                    jobs.find((j) => j._id === selectedJob)?.command || ""
                  )}
                >
                  {getJobType(
                    jobs.find((j) => j._id === selectedJob)?.command || ""
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Assign Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAssignJob}
            disabled={!selectedWorker || !selectedJob || assigning}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              !selectedWorker || !selectedJob || assigning
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {assigning ? "Assigning..." : "Assign Job"}
          </button>
        </div>
      </div>
    </div>
  );
});

WorkerAssignment.displayName = "WorkerAssignment";

export default WorkerAssignment;
