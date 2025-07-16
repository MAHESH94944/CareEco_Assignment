import { useEffect, useMemo, useCallback } from "react";
import useJobStore from "../stores/jobStore";

export const useJobs = () => {
  const {
    jobs,
    loading,
    error,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
    executeJob,
    setSelectedJob,
    selectedJob,
    clearError,
    filters,
    setFilters,
    getFilteredJobs,
    getJobStats,
  } = useJobStore();

  // Memoize filtered jobs to avoid unnecessary recalculations
  const filteredJobs = useMemo(() => getFilteredJobs(), [jobs, filters]);

  // Memoize job statistics
  const jobStats = useMemo(() => getJobStats(), [jobs]);

  // Memoized fetch function to prevent unnecessary re-renders
  const memoizedFetchJobs = useCallback(fetchJobs, [fetchJobs]);

  useEffect(() => {
    memoizedFetchJobs();
  }, [memoizedFetchJobs]);

  // Memoize actions object to prevent unnecessary re-renders
  const actions = useMemo(
    () => ({
      fetchJobs: memoizedFetchJobs,
      createJob,
      updateJob,
      deleteJob,
      executeJob,
      setSelectedJob,
      clearError,
      setFilters,
    }),
    [
      memoizedFetchJobs,
      createJob,
      updateJob,
      deleteJob,
      executeJob,
      setSelectedJob,
      clearError,
      setFilters,
    ]
  );

  return {
    jobs,
    filteredJobs,
    jobStats,
    loading,
    error,
    selectedJob,
    filters,
    actions,
  };
};

export const useJobOperations = () => {
  const { createJob, updateJob, deleteJob, executeJob } = useJobStore();

  // Memoize operation handlers
  const handleCreateJob = useCallback(
    async (jobData) => {
      try {
        await createJob(jobData);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [createJob]
  );

  const handleUpdateJob = useCallback(
    async (jobId, updates) => {
      try {
        await updateJob(jobId, updates);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [updateJob]
  );

  const handleDeleteJob = useCallback(
    async (jobId) => {
      try {
        await deleteJob(jobId);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [deleteJob]
  );

  const handleExecuteJob = useCallback(
    async (jobId) => {
      try {
        await executeJob(jobId);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [executeJob]
  );

  return {
    handleCreateJob,
    handleUpdateJob,
    handleDeleteJob,
    handleExecuteJob,
  };
};
