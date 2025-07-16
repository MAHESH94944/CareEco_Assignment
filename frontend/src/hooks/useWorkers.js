import { useEffect, useMemo, useCallback } from "react";
import useWorkerStore from "../stores/workerStore";

export const useWorkers = () => {
  const {
    workers,
    clusterStats,
    loading,
    error,
    lastUpdated,
    fetchWorkers,
    assignJob,
    releaseWorker,
    setSelectedWorker,
    selectedWorker,
    clearError,
    getWorkersByStatus,
    getWorkersByCapabilityFromStore,
    getWorkerStats,
    getCapabilityDistribution,
  } = useWorkerStore();

  // Memoize computed values
  const workerStats = useMemo(() => getWorkerStats(), [workers]);
  const capabilityDistribution = useMemo(() => getCapabilityDistribution(), [workers]);

  // Memoized fetch function
  const memoizedFetchWorkers = useCallback(fetchWorkers, [fetchWorkers]);

  useEffect(() => {
    memoizedFetchWorkers();
  }, [memoizedFetchWorkers]);

  // Auto-refresh with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      memoizedFetchWorkers();
    }, 30000);

    return () => clearInterval(interval);
  }, [memoizedFetchWorkers]);

  // Memoize actions object
  const actions = useMemo(() => ({
    fetchWorkers: memoizedFetchWorkers,
    assignJob,
    releaseWorker,
    setSelectedWorker,
    clearError,
    getWorkersByStatus,
    getWorkersByCapabilityFromStore,
  }), [memoizedFetchWorkers, assignJob, releaseWorker, setSelectedWorker, clearError, getWorkersByStatus, getWorkersByCapabilityFromStore]);

  return {
    workers,
    clusterStats,
    workerStats,
    capabilityDistribution,
    loading,
    error,
    lastUpdated,
    selectedWorker,
    actions,
  };
};

export const useWorkerOperations = () => {
  const { assignJob, releaseWorker, getWorkerById } = useWorkerStore();

  // Memoize operation handlers
  const handleAssignJob = useCallback(async (workerId, jobId) => {
    try {
      await assignJob(workerId, jobId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [assignJob]);

  const handleReleaseWorker = useCallback(async (workerId, jobSuccess = true) => {
    try {
      await releaseWorker(workerId, jobSuccess);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [releaseWorker]);

  const handleGetWorkerDetails = useCallback(async (workerId) => {
    try {
      const worker = await getWorkerById(workerId);
      return { success: true, worker };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [getWorkerById]);

  return {
    handleAssignJob,
    handleReleaseWorker,
    handleGetWorkerDetails,
  };
};
