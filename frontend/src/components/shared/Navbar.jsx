import { useState, useEffect } from "react";
import { useWorkers } from "../../hooks/useWorkers";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { actions, clusterStats } = useWorkers();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const refreshData = async () => {
    setIsRefreshing(true);
    await actions.fetchWorkers();
    setLastUpdated(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Live time update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path.startsWith("/jobs")) return "Jobs";
    if (path.startsWith("/workers")) return "Workers";
    return "Job Scheduler";
  };

  const getSystemStatus = () => {
    if (!clusterStats)
      return { status: "loading", text: "Loading...", color: "yellow" };

    const totalWorkers = clusterStats.totalWorkers || 0;
    const activeWorkers = clusterStats.activeWorkers || 0;
    const offlineWorkers = clusterStats.offlineWorkers || 0;

    if (offlineWorkers > totalWorkers * 0.3) {
      return { status: "critical", text: "System Issues", color: "red" };
    } else if (offlineWorkers > 0) {
      return { status: "warning", text: "Minor Issues", color: "yellow" };
    } else {
      return {
        status: "healthy",
        text: "All Systems Operational",
        color: "green",
      };
    }
  };

  const systemStatus = getSystemStatus();

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-2xl relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Section - Logo & Title */}
          <div className="flex items-center space-x-4 min-w-0 flex-shrink-0">
            <div className="flex items-center space-x-3">
              {/* Animated Logo */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:shadow-blue-500/25">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Title & Breadcrumb */}
              <div className="hidden sm:block min-w-0">
                <div className="flex items-center space-x-2 text-white">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
                    Job Scheduler
                  </h1>
                  <span className="text-gray-400 hidden md:inline">•</span>
                  <span className="text-gray-300 font-medium hidden md:inline whitespace-nowrap">
                    {getPageTitle()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full bg-${systemStatus.color}-400 animate-pulse flex-shrink-0`}
                  ></div>
                  <span className="text-xs text-gray-400 truncate">
                    {systemStatus.text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Live Time Display */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-md mx-8">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 px-4 py-3 min-w-0 flex-shrink-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono tracking-wider">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Cluster Status (moved to mobile only) */}
          <div className="hidden xl:flex items-center space-x-3 flex-shrink-0">
            {clusterStats && (
              <div className="flex items-center space-x-3">
                {/* Active Workers */}
                <div className="group relative">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg border border-green-500/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                    <div className="text-sm whitespace-nowrap">
                      <span className="font-bold text-green-300">
                        {clusterStats.activeWorkers}
                      </span>
                      <span className="text-green-400 ml-1">Active</span>
                    </div>
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Workers Online
                  </div>
                </div>

                {/* Busy Workers */}
                <div className="group relative">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse flex-shrink-0"></div>
                    <div className="text-sm whitespace-nowrap">
                      <span className="font-bold text-blue-300">
                        {clusterStats.busyWorkers}
                      </span>
                      <span className="text-blue-400 ml-1">Busy</span>
                    </div>
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Workers Executing Jobs
                  </div>
                </div>

                {/* Offline Workers */}
                <div className="group relative">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse flex-shrink-0"></div>
                    <div className="text-sm whitespace-nowrap">
                      <span className="font-bold text-red-300">
                        {clusterStats.offlineWorkers}
                      </span>
                      <span className="text-red-400 ml-1">Offline</span>
                    </div>
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Workers Offline
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Refresh Button */}
            <div className="relative group">
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="relative p-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 hover:shadow-lg"
                title="Refresh data"
              >
                <svg
                  className={`w-4 h-4 text-gray-300 transition-all duration-300 ${
                    isRefreshing
                      ? "animate-spin text-blue-400"
                      : "group-hover:text-white group-hover:rotate-180"
                  }`}
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
                {isRefreshing && (
                  <div className="absolute inset-0 rounded-lg bg-blue-500/20 animate-ping"></div>
                )}
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg"
              >
                <svg
                  className="w-4 h-4 text-gray-300 hover:text-white transition-colors duration-300"
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

                {/* Notification Badge */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                </div>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 transform opacity-0 scale-95 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-3 hover:bg-gray-700 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                        <div className="min-w-0">
                          <p className="text-white text-sm">Worker offline</p>
                          <p className="text-gray-400 text-xs">
                            worker-11 went offline
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-gray-700 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                        <div className="min-w-0">
                          <p className="text-white text-sm">Job failed</p>
                          <p className="text-gray-400 text-xs">
                            Script job failed execution
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-gray-700 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <div className="min-w-0">
                          <p className="text-white text-sm">System healthy</p>
                          <p className="text-gray-400 text-xs">
                            All systems operational
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">AD</span>
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <p className="text-white text-sm font-medium">Admin</p>
                  <p className="text-gray-400 text-xs">System Admin</p>
                </div>
                <svg
                  className="w-3 h-3 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 transform opacity-0 scale-95 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">AD</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium">Admin User</p>
                        <p className="text-gray-400 text-sm truncate">
                          admin@company.com
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200">
                      System Preferences
                    </button>
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200">
                      Help & Support
                    </button>
                    <hr className="my-2 border-gray-700" />
                    <button className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors duration-200">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Last Updated - Large screens only */}
            <div className="hidden 2xl:flex items-center space-x-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
              <div className="text-xs text-gray-400">
                <span className="text-gray-300">Last sync:</span>
                <br />
                <span className="font-mono whitespace-nowrap">
                  {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Status Bar */}
      <div className="xl:hidden bg-gray-800/50 border-t border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile Live Time */}
          <div className="flex items-center space-x-3">
            <div className="text-white font-mono text-sm font-bold">
              {currentTime.toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
            <div className="text-xs text-gray-400">
              {currentTime.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Mobile Cluster Status */}
          <div className="flex items-center space-x-4 overflow-x-auto">
            {clusterStats && (
              <>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-300 font-medium whitespace-nowrap">
                    {clusterStats.activeWorkers} Active
                  </span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-300 font-medium whitespace-nowrap">
                    {clusterStats.busyWorkers} Busy
                  </span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-300 font-medium whitespace-nowrap">
                    {clusterStats.offlineWorkers} Offline
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
