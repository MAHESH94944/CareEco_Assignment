import React from "react";
import { Helmet } from "react-helmet-async";
import { useWorkers } from "../../hooks/useWorkers";
import WorkerGrid from "../../components/workers/WorkerGrid";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const Workers = React.memo(() => {
  const { workers, clusterStats, loading } = useWorkers();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>
          Workers Management - TaskCron | Distributed Worker Cluster
        </title>
        <meta
          name="description"
          content="Monitor your distributed worker cluster with TaskCron. View real-time worker status, capabilities, and performance metrics for optimal job distribution."
        />
        <meta
          name="keywords"
          content="worker management, distributed system, cluster monitoring, worker status, job distribution, system performance"
        />
        <link rel="canonical" href="https://taskcron.onrender.com/workers" />
        <meta
          property="og:title"
          content="Workers Management - TaskCron | Distributed Worker Cluster"
        />
        <meta
          property="og:description"
          content="Monitor your distributed worker cluster with real-time status and performance metrics."
        />
        <meta
          property="og:url"
          content="https://taskcron.onrender.com/workers"
        />
      </Helmet>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workers</h1>
              <p className="text-sm text-gray-600 mt-1">
                Monitor your distributed worker cluster
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {workers?.length || 0} workers total
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cluster Statistics */}
        {clusterStats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {clusterStats.totalWorkers}
              </div>
              <div className="text-sm text-gray-500">Total Workers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {clusterStats.activeWorkers}
              </div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {clusterStats.busyWorkers}
              </div>
              <div className="text-sm text-gray-500">Busy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {clusterStats.idleWorkers}
              </div>
              <div className="text-sm text-gray-500">Idle</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {clusterStats.offlineWorkers}
              </div>
              <div className="text-sm text-gray-500">Offline</div>
            </div>
          </div>
        )}

        {/* Workers Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Workers</h3>
          </div>
          <div className="p-6">
            <WorkerGrid workers={workers || []} />
          </div>
        </div>
      </div>
    </div>
  );
});

Workers.displayName = "Workers";

export default Workers;
