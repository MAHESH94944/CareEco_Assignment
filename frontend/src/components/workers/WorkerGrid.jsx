import StatusBadge from "../shared/StatusBadge";

const WorkerGrid = ({ workers }) => {
  if (!workers || workers.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-12 h-12 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
        <p className="text-gray-500 text-sm">No workers found</p>
      </div>
    );
  }

  const getCapabilityIcon = (capability) => {
    switch (capability) {
      case "script":
        return (
          <svg
            className="w-4 h-4 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        );
      case "api":
        return (
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
            />
          </svg>
        );
      case "shell":
        return (
          <svg
            className="w-4 h-4 text-green-600"
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workers.map((worker) => (
        <div
          key={worker.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
        >
          {/* Worker Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {worker.id}
                </h3>
                <p className="text-sm text-gray-500">{worker.uptime}</p>
              </div>
            </div>
            <StatusBadge status={worker.status} />
          </div>

          {/* Worker Details */}
          <div className="space-y-4">
            {/* Capabilities */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Capabilities
              </p>
              <div className="flex flex-wrap gap-2">
                {worker.capabilities.map((cap) => (
                  <div
                    key={cap}
                    className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full"
                  >
                    {getCapabilityIcon(cap)}
                    <span className="text-xs font-medium text-gray-700 capitalize">
                      {cap}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Job */}
            {worker.currentJob && (
              <div>
                <p className="text-sm font-medium text-gray-700">Current Job</p>
                <p className="text-sm text-gray-600 truncate">
                  {worker.currentJob}
                </p>
              </div>
            )}

            {/* Health Status */}
            {worker.healthStatus && (
              <div>
                <p className="text-sm font-medium text-gray-700">Health</p>
                <p className="text-sm text-gray-600">
                  {worker.healthStatus.message}
                </p>
                {worker.healthStatus.consecutiveFailures > 0 && (
                  <p className="text-sm text-red-600">
                    {worker.healthStatus.consecutiveFailures} consecutive
                    failures
                  </p>
                )}
              </div>
            )}

            {/* Load Percentage */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Load</p>
                <p className="text-sm text-gray-600">
                  {worker.loadPercentage}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    worker.loadPercentage > 80
                      ? "bg-red-500"
                      : worker.loadPercentage > 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${worker.loadPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Job Statistics */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {worker.jobsCompleted || 0}
                </p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">
                  {worker.jobsFailed || 0}
                </p>
                <p className="text-xs text-gray-500">Failed</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkerGrid;
