import React, { useMemo, useCallback } from "react";
import { useJobs } from "../hooks/useJobs";
import { useWorkers } from "../hooks/useWorkers";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import JobCard from "../components/jobs/JobCard";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const Dashboard = React.memo(() => {
  const { jobs, jobStats, loading: jobsLoading } = useJobs();
  const { workers, clusterStats, loading: workersLoading } = useWorkers();
  const navigate = useNavigate();

  // Memoize recent jobs to prevent unnecessary recalculations
  const recentJobs = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return [];
    return jobs.slice(0, 4);
  }, [jobs]);

  // Memoize navigation handlers
  const navigateToNewJob = useCallback(() => navigate("/jobs/new"), [navigate]);
  const navigateToWorkers = useCallback(() => navigate("/workers"), [navigate]);
  const navigateToJobs = useCallback(() => navigate("/jobs"), [navigate]);

  // Memoize stats cards data
  const statsCards = useMemo(() => {
    if (!jobStats || !clusterStats) return [];

    return [
      {
        title: "Total Jobs",
        value: jobStats.total || 0,
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
        color: "blue",
        subtitle: `+${jobStats.success || 0} completed`,
      },
      {
        title: "Running Jobs",
        value: jobStats.running || 0,
        icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8M5 12a7 7 0 1114 0v3.5a6.5 6.5 0 11-13 0V12z",
        color: "green",
        subtitle: "Currently executing",
      },
      {
        title: "Failed Jobs",
        value: jobStats.failed || 0,
        icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        color: "red",
        subtitle: `${jobStats.pending || 0} pending retry`,
      },
      {
        title: "Active Workers",
        value: workers?.length || 0,
        icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
        color: "purple",
        subtitle: `${clusterStats?.busyWorkers || 0} currently busy`,
      },
    ];
  }, [jobStats, workers, clusterStats]);

  if (jobsLoading || workersLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Dashboard - TaskCron | Distributed Job Scheduling System</title>
        <meta
          name="description"
          content="Monitor your distributed job scheduler performance with real-time statistics, worker status, and job execution analytics. TaskCron dashboard provides comprehensive insights into your automated tasks."
        />
        <meta
          name="keywords"
          content="job scheduler dashboard, task monitoring, worker status, job analytics, cron dashboard, distributed system monitoring"
        />
        <link rel="canonical" href="https://taskcron.onrender.com/" />
        <meta
          property="og:title"
          content="Dashboard - TaskCron | Distributed Job Scheduling System"
        />
        <meta
          property="og:description"
          content="Monitor your distributed job scheduler performance with real-time statistics, worker status, and job execution analytics."
        />
        <meta property="og:url" content="https://taskcron.onrender.com/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "TaskCron Dashboard",
            url: "https://taskcron.onrender.com/",
            description:
              "Real-time monitoring dashboard for distributed job scheduling system",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
          })}
        </script>
      </Helmet>

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Monitor your distributed job scheduler performance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
                Live Data
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                >
                  <svg
                    className={`w-6 h-6 text-${stat.color}-600`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={stat.icon}
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-500">{stat.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Jobs Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Jobs
                  </h3>
                  <button
                    onClick={navigateToJobs}
                    className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                  >
                    View all
                  </button>
                </div>
              </div>
              <div className="p-6">
                {recentJobs.length === 0 ? (
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm">No jobs created yet</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Create your first job to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentJobs.map((job, index) => (
                      <JobCard key={job._id} job={job} index={index} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Cluster Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cluster Status
                </h3>
              </div>
              <div className="p-6">
                {clusterStats ? (
                  <div className="space-y-4">
                    {[
                      {
                        label: "Active",
                        value: clusterStats.activeWorkers,
                        color: "green",
                      },
                      {
                        label: "Busy",
                        value: clusterStats.busyWorkers,
                        color: "blue",
                      },
                      {
                        label: "Idle",
                        value: clusterStats.idleWorkers,
                        color: "yellow",
                      },
                      {
                        label: "Offline",
                        value: clusterStats.offlineWorkers,
                        color: "red",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full bg-${stat.color}-500`}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">
                            {stat.label}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Worker Capabilities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Worker Capabilities
                </h3>
              </div>
              <div className="p-6">
                {clusterStats?.capabilityStats ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
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
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Script
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {clusterStats.capabilityStats.script}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
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
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          API
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {clusterStats.capabilityStats.api}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
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
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Shell
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {clusterStats.capabilityStats.shell}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={navigateToNewJob}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  Create New Job
                </button>
                <button
                  onClick={navigateToWorkers}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                  View All Workers
                </button>
                <button
                  onClick={navigateToJobs}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                  View All Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
