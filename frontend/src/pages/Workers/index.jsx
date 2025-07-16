import { useWorkers } from "../../hooks/useWorkers";
import WorkerGrid from "../../components/workers/WorkerGrid";

const Workers = () => {
  const { workers, clusterStats, loading } = useWorkers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Workers</h1>
        <div className="text-sm text-gray-500">
          {workers.length} workers total
        </div>
      </div>

      {/* Cluster Stats */}
      {clusterStats && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Cluster Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
        </div>
      )}

      {/* Workers Grid */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            All Workers
          </h3>

          {loading ? (
            <div className="text-center py-8">Loading workers...</div>
          ) : (
            <WorkerGrid workers={workers} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Workers;
