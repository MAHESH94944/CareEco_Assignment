import { useJobOperations } from "../../hooks/useJobs";
import { toast } from "react-hot-toast";
import StatusBadge from "../shared/StatusBadge";
import { PlayIcon, TrashIcon } from "@heroicons/react/24/outline";

const JobCard = ({ job }) => {
  const { handleExecuteJob, handleDeleteJob } = useJobOperations();

  const onExecute = async () => {
    const result = await handleExecuteJob(job._id);
    if (result.success) {
      toast.success("Job queued for execution");
    } else {
      toast.error(result.error);
    }
  };

  const onDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      const result = await handleDeleteJob(job._id);
      if (result.success) {
        toast.success("Job deleted successfully");
      } else {
        toast.error(result.error);
      }
    }
  };

  const getJobTypeColor = (command) => {
    if (command.startsWith("script:")) return "bg-purple-100 text-purple-800";
    if (command.startsWith("http")) return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  const getJobType = (command) => {
    if (command.startsWith("script:")) return "script";
    if (command.startsWith("http")) return "api";
    return "shell";
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <h3 className="font-medium text-gray-900">{job.name}</h3>
          <StatusBadge status={job.status} />
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobTypeColor(
              job.command
            )}`}
          >
            {getJobType(job.command)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onExecute}
            disabled={job.status === "running"}
            className="p-1 text-green-600 hover:text-green-800 disabled:text-gray-400"
            title="Execute job"
          >
            <PlayIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete job"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <p>
            <strong>Schedule:</strong> {job.schedule}
          </p>
          <p>
            <strong>Priority:</strong> {job.priority}
          </p>
        </div>
        <div>
          <p>
            <strong>Last Run:</strong>{" "}
            {job.lastRun ? new Date(job.lastRun).toLocaleString() : "Never"}
          </p>
          <p>
            <strong>Success Rate:</strong> {job.successfulRuns || 0}/
            {job.totalRuns || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
