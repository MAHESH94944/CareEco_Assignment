import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
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
