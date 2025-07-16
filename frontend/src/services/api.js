import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://taskcron-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for better reliability
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor with performance optimization
api.interceptors.request.use(
  (config) => {
    // Only log in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("Request error:", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor with caching
api.interceptors.response.use(
  (response) => {
    // Cache successful responses for 5 minutes
    if (response.config.method === "get") {
      const cacheKey = `${response.config.url}_${JSON.stringify(
        response.config.params
      )}`;
      const cacheData = {
        data: response.data,
        timestamp: Date.now(),
      };
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (e) {
        // Ignore storage errors
      }
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("API Error:", error.response?.data || error.message);
    }
    const message =
      error.response?.data?.error || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

// Job API endpoints
export const jobsApi = {
  // Get all jobs with optional filters
  getJobs: async (params = {}) => {
    const response = await api.get("/jobs", { params });
    return response.data;
  },

  // Create new job
  createJob: async (jobData) => {
    const response = await api.post("/jobs", jobData);
    return response.data;
  },

  // Get job by ID
  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Update job
  updateJob: async (jobId, updates) => {
    const response = await api.put(`/jobs/${jobId}`, updates);
    return response.data;
  },

  // Delete job
  deleteJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },

  // Get job status
  getJobStatus: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/status`);
    return response.data;
  },

  // Get job history
  getJobHistory: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/history`);
    return response.data;
  },

  // Execute job manually
  executeJob: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/execute`);
    return response.data;
  },
};

// Worker API endpoints
export const workersApi = {
  // Get all workers with cluster stats
  getWorkers: async () => {
    const response = await api.get("/workers");
    return response.data;
  },

  // Get worker by ID
  getWorkerById: async (workerId) => {
    const response = await api.get(`/workers/${workerId}`);
    return response.data;
  },

  // Get cluster stats
  getClusterStats: async () => {
    const response = await api.get("/workers/stats");
    return response.data;
  },

  // Get workers by capability
  getWorkersByCapability: async (capability) => {
    const response = await api.get(`/workers/capability/${capability}`);
    return response.data;
  },

  // Assign job to worker
  assignJob: async (workerId, jobId) => {
    const response = await api.post("/workers/assign", { workerId, jobId });
    return response.data;
  },

  // Release worker
  releaseWorker: async (workerId, jobSuccess = true) => {
    const response = await api.post(`/workers/${workerId}/release`, {
      jobSuccess,
    });
    return response.data;
  },
};

export default api;
