import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await api.post('/api/auth/register', { username, email, password });
    return response.data;
  },
};

// Agents API
export const agentsAPI = {
  getAll: async () => {
    const response = await api.get('/api/agents');
    return response.data;
  },

  create: async (agentData) => {
    const response = await api.post('/api/agents', agentData);
    return response.data;
  },

  update: async (id, agentData) => {
    const response = await api.put(`/api/agents/${id}`, agentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/agents/${id}`);
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (messageData) => {
    const response = await api.post('/api/chat', messageData);
    return response.data;
  },

  getConversation: async (conversationId) => {
    const response = await api.get(`/api/conversations/${conversationId}`);
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get('/api/conversations');
    return response.data;
  },
};

// Files API
export const filesAPI = {
  upload: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  download: async (fileId) => {
    const response = await api.get(`/api/files/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/api/files');
    return response.data;
  },

  delete: async (fileId) => {
    const response = await api.delete(`/api/files/${fileId}`);
    return response.data;
  },
};

// Web Scraping API
export const scrapingAPI = {
  scrape: async (url, selector) => {
    const response = await api.post('/api/scrape', { url, selector });
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;