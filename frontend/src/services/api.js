import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jobportal-q24l.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ─── Jobs ──────────────────────────────────────────────────────────────────
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  getAllAdmin: () => api.get('/jobs/admin/all'),
};

// ─── Applications ───────────────────────────────────────────────────────────
export const applicationsAPI = {
  apply: (jobId, data) => api.post(`/applications/job/${jobId}`, data),
  getMyApplications: () => api.get('/applications/my'),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  getAllAdmin: () => api.get('/applications/admin/all'),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};

export default api;
