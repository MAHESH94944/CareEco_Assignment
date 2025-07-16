import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { workersApi } from "../services/api";

const useWorkerStore = create(
  devtools(
    (set, get) => ({
      // State
      workers: [],
      clusterStats: null,
      selectedWorker: null,
      loading: false,
      error: null,
      lastUpdated: null,

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Fetch all workers
      fetchWorkers: async () => {
        set({ loading: true, error: null });
        try {
          const response = await workersApi.getWorkers();
          set({
            workers: response.workers || [],
            clusterStats: response.clusterStats,
            loading: false,
            lastUpdated: new Date(),
          });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      // Get worker by ID
      getWorkerById: async (workerId) => {
        try {
          const response = await workersApi.getWorkerById(workerId);
          return response;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Get cluster statistics
      fetchClusterStats: async () => {
        try {
          const response = await workersApi.getClusterStats();
          set({ clusterStats: response });
          return response;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Get workers by capability
      getWorkersByCapability: async (capability) => {
        try {
          const response = await workersApi.getWorkersByCapability(capability);
          return response;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Assign job to worker
      assignJob: async (workerId, jobId) => {
        try {
          const response = await workersApi.assignJob(workerId, jobId);
          // Update worker status in the store
          const currentWorkers = get().workers;
          const updatedWorkers = currentWorkers.map((worker) =>
            worker.id === workerId
              ? { ...worker, status: "busy", currentJob: jobId }
              : worker
          );
          set({ workers: updatedWorkers });
          return response;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Release worker
      releaseWorker: async (workerId, jobSuccess = true) => {
        try {
          const response = await workersApi.releaseWorker(workerId, jobSuccess);
          // Update worker status in the store
          const currentWorkers = get().workers;
          const updatedWorkers = currentWorkers.map((worker) =>
            worker.id === workerId
              ? { ...worker, status: "idle", currentJob: null }
              : worker
          );
          set({ workers: updatedWorkers });
          return response;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Set selected worker
      setSelectedWorker: (worker) => set({ selectedWorker: worker }),

      // Get workers by status
      getWorkersByStatus: (status) => {
        const { workers } = get();
        return workers.filter((worker) => worker.status === status);
      },

      // Get workers by capability from store
      getWorkersByCapabilityFromStore: (capability) => {
        const { workers } = get();
        return workers.filter((worker) =>
          worker.capabilities.includes(capability)
        );
      },

      // Get worker statistics
      getWorkerStats: () => {
        const { workers } = get();
        return {
          total: workers.length,
          active: workers.filter((worker) => worker.status !== "offline")
            .length,
          idle: workers.filter((worker) => worker.status === "idle").length,
          busy: workers.filter((worker) => worker.status === "busy").length,
          offline: workers.filter((worker) => worker.status === "offline")
            .length,
        };
      },

      // Get capability distribution
      getCapabilityDistribution: () => {
        const { workers } = get();
        const distribution = { script: 0, api: 0, shell: 0 };

        workers.forEach((worker) => {
          worker.capabilities.forEach((capability) => {
            if (distribution[capability] !== undefined) {
              distribution[capability]++;
            }
          });
        });

        return distribution;
      },

      // Auto-refresh workers
      startAutoRefresh: (interval = 30000) => {
        const refreshInterval = setInterval(() => {
          get().fetchWorkers();
        }, interval);

        return refreshInterval;
      },
    }),
    {
      name: "worker-store",
    }
  )
);

export default useWorkerStore;
