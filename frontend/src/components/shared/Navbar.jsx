import { useState, useEffect } from "react";
import { useWorkers } from "../../hooks/useWorkers";

const Navbar = () => {
  const { actions, clusterStats } = useWorkers();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshData = () => {
    actions.fetchWorkers();
    setLastUpdated(new Date());
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Distributed Job Scheduler
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Cluster Status */}
            {clusterStats && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{clusterStats.activeWorkers} Active</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{clusterStats.busyWorkers} Busy</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{clusterStats.offlineWorkers} Offline</span>
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={refreshData}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              title="Refresh data"
            >
              <svg
                className="w-5 h-5"
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
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5-5-5h5V3h10v14z"
                />
              </svg>
            </button>

            {/* Last Updated */}
            <div className="text-xs text-gray-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
