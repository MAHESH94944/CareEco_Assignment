import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { jobsApi } from "../services/api";

const useJobStore = create(
  devtools(
    (set, get) => ({
      // State
      jobs: [],
      selectedJob: null,
      loading: false,
      error: null,
      filters: {
        status: "",
        priority: "",
        search: "",
      },

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Fetch all jobs
      fetchJobs: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await jobsApi.getJobs(params);
          set({ jobs: response.jobs || [], loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      // Create new job
      createJob: async (jobData) => {
        set({ loading: true, error: null });
        try {
          const response = await jobsApi.createJob(jobData);
          const currentJobs = get().jobs;
          set({
            jobs: [...currentJobs, response.job],
            loading: false,
          });
          return response.job;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Update job
      updateJob: async (jobId, updates) => {
        set({ loading: true, error: null });
        try {
          const response = await jobsApi.updateJob(jobId, updates);
          const currentJobs = get().jobs;
          const updatedJobs = currentJobs.map((job) =>
            job._id === jobId ? response.job : job
          );
          set({ jobs: updatedJobs, loading: false });
          return response.job;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Delete job
      deleteJob: async (jobId) => {
        set({ loading: true, error: null });
        try {
          await jobsApi.deleteJob(jobId);
          const currentJobs = get().jobs;
          const filteredJobs = currentJobs.filter((job) => job._id !== jobId);
          set({ jobs: filteredJobs, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Execute job
      executeJob: async (jobId) => {
        try {
          const response = await jobsApi.executeJob(jobId);
          const currentJobs = get().jobs;
          const updatedJobs = currentJobs.map((job) =>
            job._id === jobId ? { ...job, status: "pending" } : job
          );
          set({ jobs: updatedJobs });
          return response;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Set selected job
      setSelectedJob: (job) => set({ selectedJob: job }),

      // Set filters
      setFilters: (filters) => set({ filters }),

      // Get filtered jobs
      getFilteredJobs: () => {
        const { jobs, filters } = get();
        return jobs.filter((job) => {
          const matchesStatus =
            !filters.status || job.status === filters.status;
          const matchesPriority =
            !filters.priority || job.priority === filters.priority;
          const matchesSearch =
            !filters.search ||
            job.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            job.command.toLowerCase().includes(filters.search.toLowerCase());

          return matchesStatus && matchesPriority && matchesSearch;
        });
      },

      // Get job statistics
      getJobStats: () => {
        const { jobs } = get();
        return {
          total: jobs.length,
          pending: jobs.filter((job) => job.status === "pending").length,
          running: jobs.filter((job) => job.status === "running").length,
          success: jobs.filter((job) => job.status === "success").length,
          failed: jobs.filter((job) => job.status === "failed").length,
        };
      },
    }),
    {
      name: "job-store",
    }
  )
);

export default useJobStore;
