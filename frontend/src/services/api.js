import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with optimized settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 second timeout
  // Enable request/response compression
  decompress: true
});

// Request queue to prevent duplicate requests
const requestQueue = new Map();

// Request deduplication interceptor
api.interceptors.request.use(
  (config) => {
    // Create unique key for request
    const requestKey = `${config.method}-${config.url}-${JSON.stringify(config.params || {})}-${JSON.stringify(config.data || {})}`;
    
    // Check if same request is already in progress
    if (requestQueue.has(requestKey)) {
      // Return the existing promise
      return requestQueue.get(requestKey);
    }
    
    // Store the request promise
    const requestPromise = Promise.resolve(config);
    requestQueue.set(requestKey, requestPromise);
    
    // Clean up after request completes
    requestPromise.finally(() => {
      requestQueue.delete(requestKey);
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  updatePassword: (id, data) => api.put(`/users/${id}/password`, data),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

// Stores API with optimized pagination
export const storesAPI = {
  getStores: (params) => {
    const optimizedParams = {
      ...params,
      limit: params.limit || 20, // Default pagination
      page: params.page || 1
    };
    return api.get('/stores', { params: optimizedParams });
  },
  getStore: (id) => api.get(`/stores/${id}`),
  createStore: (data) => api.post('/stores', data),
  updateStore: (id, data) => api.put(`/stores/${id}`, data),
  deleteStore: (id) => api.delete(`/stores/${id}`),
  getStoresByOwner: (ownerId) => api.get(`/stores/owner/${ownerId}`),
  // Lightweight search for autocomplete
  searchStores: (query, limit = 10) => api.get('/stores/search', { 
    params: { q: query, limit } 
  })
};

// Ratings API
export const ratingsAPI = {
  createRating: (data) => api.post('/ratings', data),
  getStoreRatings: (storeId, params) => api.get(`/ratings/store/${storeId}`, { params }),
  getUserRatings: (userId, params) => api.get(`/ratings/user/${userId}`, { params }),
  deleteRating: (id) => api.delete(`/ratings/${id}`)
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  createUser: (data) => api.post('/admin/users', data),
  createStore: (data) => api.post('/admin/stores', data),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  getAnalytics: (params) => api.get('/admin/analytics', { params })
};

export default api;
