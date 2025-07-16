import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobsApi } from "../../services/api";
import { toast } from "react-hot-toast";
import StatusBadge from "../shared/StatusBadge";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    fetchJobHistory();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobsApi.getJobById(id);
      setJob(response);
    } catch (error) {
      toast.error("Failed to fetch job details");
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobHistory = async () => {
    try {
      const response = await jobsApi.getJobHistory(id);
      setHistory(response);
    } catch (error) {
      console.error("Failed to fetch job history:", error);
    }
  };

  const handleExecute = async () => {
    if (!job || job.status === "running") return;

    setExecuting(true);
    try {
      await jobsApi.executeJob(id);
      toast.success("Job queued for execution");
      fetchJobDetails(); // Refresh job details
    } catch (error) {
      toast.error("Failed to execute job: " + error.message);
    } finally {
      setExecuting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await jobsApi.deleteJob(id);
      toast.success("Job deleted successfully");
      navigate("/jobs");
    } catch (error) {
      toast.error("Failed to delete job: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <button
          onClick={() => navigate("/jobs")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">{job.name}</h1>
            <StatusBadge status={job.status} />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExecute}
              disabled={job.status === "running" || executing}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                job.status === "running" || executing
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {executing ? "Executing..." : "Execute Now"}
            </button>
            <button
              onClick={() => navigate(`/jobs/${id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Job Configuration</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Schedule:</span>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded">
                  {job.schedule}
                </code>
              </div>
              <div>
                <span className="font-medium">Priority:</span>
                <span className="ml-2">{job.priority}</span>
              </div>
              <div>
                <span className="font-medium">Retry Policy:</span>
                <span className="ml-2">{job.retryPolicy} retries</span>
              </div>
              <div>
                <span className="font-medium">Command:</span>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded block mt-1">
                  {job.command}
                </code>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Execution Stats</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Total Runs:</span>
                <span className="ml-2">{job.totalRuns || 0}</span>
              </div>
              <div>
                <span className="font-medium">Successful:</span>
                <span className="ml-2 text-green-600">
                  {job.successfulRuns || 0}
                </span>
              </div>
              <div>
                <span className="font-medium">Failed:</span>
                <span className="ml-2 text-red-600">{job.failedRuns || 0}</span>
              </div>
              <div>
                <span className="font-medium">Last Run:</span>
                <span className="ml-2">
                  {job.lastRun
                    ? new Date(job.lastRun).toLocaleString()
                    : "Never"}
                </span>
              </div>
              <div>
                <span className="font-medium">Next Run:</span>
                <span className="ml-2">
                  {job.nextRun
                    ? new Date(job.nextRun).toLocaleString()
                    : "Not scheduled"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dependencies */}
      {job.dependencies && job.dependencies.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Dependencies</h3>
          <div className="space-y-2">
            {job.dependencies.map((dep) => (
              <div
                key={dep._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <span className="font-medium">{dep.name}</span>
                <StatusBadge status={dep.status} size="xs" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution History */}
      {history && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Execution History</h3>
          {history.executions && history.executions.length > 0 ? (
            <div className="space-y-4">
              {history.executions.slice(0, 10).map((execution, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <StatusBadge status={execution.status} size="xs" />
                      <span className="ml-2 text-sm text-gray-600">
                        {new Date(execution.startTime).toLocaleString()}
                      </span>
                    </div>
                    {execution.duration && (
                      <span className="text-sm text-gray-500">
                        {execution.duration}ms
                      </span>
                    )}
                  </div>
                  {execution.output && (
                    <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                      {execution.output}
                    </div>
                  )}
                  {execution.workerId && (
                    <div className="mt-1 text-xs text-gray-500">
                      Worker: {execution.workerId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No execution history available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetails;
