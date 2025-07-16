import { useEffect } from "react";
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

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWorkers();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchWorkers]);

  const workerStats = getWorkerStats();
  const capabilityDistribution = getCapabilityDistribution();

  return {
    workers,
    clusterStats,
    workerStats,
    capabilityDistribution,
    loading,
    error,
    lastUpdated,
    selectedWorker,
    actions: {
      fetchWorkers,
      assignJob,
      releaseWorker,
      setSelectedWorker,
      clearError,
      getWorkersByStatus,
      getWorkersByCapabilityFromStore,
    },
  };
};

export const useWorkerOperations = () => {
  const { assignJob, releaseWorker, getWorkerById } = useWorkerStore();

  const handleAssignJob = async (workerId, jobId) => {
    try {
      await assignJob(workerId, jobId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleReleaseWorker = async (workerId, jobSuccess = true) => {
    try {
      await releaseWorker(workerId, jobSuccess);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleGetWorkerDetails = async (workerId) => {
    try {
      const worker = await getWorkerById(workerId);
      return { success: true, worker };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    handleAssignJob,
    handleReleaseWorker,
    handleGetWorkerDetails,
  };
};
