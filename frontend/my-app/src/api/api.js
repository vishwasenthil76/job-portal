import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Inject JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ─── Jobs ───
export const jobsAPI = {
  getAll: (page = 0, size = 10) =>
    api.get(`/jobs?page=${page}&size=${size}`),

  search: (params) =>
    api.get('/jobs/search', { params }),

  getById: (id) => api.get(`/jobs/${id}`),

  create: (data) => api.post('/jobs', data),

  update: (id, data) => api.put(`/jobs/${id}`, data),

  delete: (id) => api.delete(`/jobs/${id}`),

  getMyJobs: () => api.get('/jobs/my-jobs'),
};

// ─── Applications ───
export const applicationsAPI = {
  apply: (jobId, formData) =>
    api.post(`/applications/apply/${jobId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getMyApplications: () => api.get('/applications/my-applications'),

  getStats: () => api.get('/applications/stats'),

  getJobApplicants: (jobId) => api.get(`/applications/job/${jobId}`),

  updateStatus: (applicationId, status) =>
    api.put(`/applications/${applicationId}/status`, { status }),

  exportExcel: (jobId) =>
    api.get(`/applications/export/excel/${jobId}`, { responseType: 'blob' }),

  exportCsv: (jobId) =>
    api.get(`/applications/export/csv/${jobId}`, { responseType: 'blob' }),
};

export default api;