import { useEffect } from "react";
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

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filteredJobs = getFilteredJobs();
  const jobStats = getJobStats();

  return {
    jobs,
    filteredJobs,
    jobStats,
    loading,
    error,
    selectedJob,
    filters,
    actions: {
      fetchJobs,
      createJob,
      updateJob,
      deleteJob,
      executeJob,
      setSelectedJob,
      clearError,
      setFilters,
    },
  };
};

export const useJobOperations = () => {
  const { createJob, updateJob, deleteJob, executeJob, setError } =
    useJobStore();

  const handleCreateJob = async (jobData) => {
    try {
      await createJob(jobData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleUpdateJob = async (jobId, updates) => {
    try {
      await updateJob(jobId, updates);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleExecuteJob = async (jobId) => {
    try {
      await executeJob(jobId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    handleCreateJob,
    handleUpdateJob,
    handleDeleteJob,
    handleExecuteJob,
  };
};
