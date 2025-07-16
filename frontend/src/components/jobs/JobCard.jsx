import React, { useState, useCallback, useMemo } from "react";
import { useJobOperations } from "../../hooks/useJobs";
import { toast } from "react-hot-toast";
import StatusBadge from "../shared/StatusBadge";

const JobCard = React.memo(({ job, index = 0 }) => {
  const { handleExecuteJob, handleDeleteJob } = useJobOperations();
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Memoize job type configuration
  const jobTypeConfig = useMemo(() => {
    if (job.command.startsWith("script:")) {
      return {
        type: "script",
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        borderColor: "border-purple-200",
      };
    }
    if (job.command.startsWith("http")) {
      return {
        type: "api",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        borderColor: "border-blue-200",
      };
    }
    return {
      type: "shell",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-200",
    };
  }, [job.command]);

  // Memoize priority configuration
  const priorityConfig = useMemo(() => {
    switch (job.priority) {
      case "High":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-200",
        };
      case "Medium":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
        };
      case "Low":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  }, [job.priority]);

  // Memoize success rate calculation
  const successRate = useMemo(() => {
    return job.totalRuns > 0
      ? ((job.successfulRuns || 0) / job.totalRuns) * 100
      : 0;
  }, [job.totalRuns, job.successfulRuns]);

  // Memoize handlers to prevent unnecessary re-renders
  const onExecute = useCallback(async () => {
    setIsExecuting(true);
    const result = await handleExecuteJob(job._id);
    if (result.success) {
      toast.success("Job queued for execution");
    } else {
      toast.error(result.error);
    }
    setIsExecuting(false);
  }, [handleExecuteJob, job._id]);

  const onDelete = useCallback(async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setIsDeleting(true);
      const result = await handleDeleteJob(job._id);
      if (result.success) {
        toast.success("Job deleted successfully");
      } else {
        toast.error(result.error);
      }
      setIsDeleting(false);
    }
  }, [handleDeleteJob, job._id]);

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 transform hover:scale-105"
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: "fadeInUp 0.5s ease-out forwards",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">{job.name}</h3>
          <StatusBadge status={job.status} />
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${jobTypeConfig.bgColor} ${jobTypeConfig.textColor} ${jobTypeConfig.borderColor} border`}
          >
            {jobTypeConfig.type}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.bgColor} ${priorityConfig.textColor} ${priorityConfig.borderColor} border`}
          >
            {job.priority}
          </span>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">Schedule</span>
          </div>
          <p className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded border">
            {job.schedule}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">Last Run</span>
          </div>
          <p className="text-sm text-gray-600">
            {job.lastRun ? new Date(job.lastRun).toLocaleString() : "Never"}
          </p>
        </div>
      </div>

      {/* Success Rate */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Success Rate
          </span>
          <span className="text-sm font-bold text-gray-900">
            {job.successfulRuns || 0}/{job.totalRuns || 0}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${successRate}%` }}
          ></div>
        </div>
      </div>

      {/* Command */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Command</span>
        </div>
        <p className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded border break-all">
          {job.command}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={onExecute}
            disabled={job.status === "running" || isExecuting}
            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
              job.status === "running" || isExecuting
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow-md"
            }`}
          >
            {isExecuting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Executing...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8M5 12a7 7 0 1114 0v3.5a6.5 6.5 0 11-13 0V12z"
                  />
                </svg>
                Execute
              </>
            )}
          </button>

          <button
            onClick={onDelete}
            disabled={isDeleting}
            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
              isDeleting
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md"
            }`}
          >
            {isDeleting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              job.status === "success"
                ? "bg-green-500"
                : job.status === "running"
                ? "bg-blue-500 animate-pulse"
                : job.status === "failed"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          ></div>
          <span className="text-sm text-gray-600 capitalize">{job.status}</span>
        </div>
      </div>
    </div>
  );
});

JobCard.displayName = "JobCard";

export default JobCard;
