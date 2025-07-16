import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";
import { toast } from "react-hot-toast";
import CronHelper from "../../components/shared/CronHelper";

const NewJob = () => {
  const navigate = useNavigate();
  const { actions } = useJobs();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    schedule: "",
    command: "",
    priority: "Medium",
    dependencies: [],
    retryPolicy: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await actions.createJob(formData);
      toast.success("Job created successfully!");
      navigate("/jobs");
    } catch (error) {
      toast.error("Failed to create job: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Create New Job
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Job Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter job name"
              />
            </div>

            <div>
              <label
                htmlFor="schedule"
                className="block text-sm font-medium text-gray-700"
              >
                Schedule (Cron Expression)
              </label>
              <input
                type="text"
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="* * * * *"
              />
              <CronHelper />
            </div>

            <div>
              <label
                htmlFor="command"
                className="block text-sm font-medium text-gray-700"
              >
                Command
              </label>
              <input
                type="text"
                id="command"
                name="command"
                value={formData.command}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="script:/path/to/script.js or http://api.example.com/endpoint"
              />
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="retryPolicy"
                className="block text-sm font-medium text-gray-700"
              >
                Retry Policy
              </label>
              <input
                type="number"
                id="retryPolicy"
                name="retryPolicy"
                value={formData.retryPolicy}
                onChange={handleChange}
                min="0"
                max="10"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewJob;
