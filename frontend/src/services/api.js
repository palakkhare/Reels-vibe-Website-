import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusconnect_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (fullName, email, password, role = 'STUDENT') =>
    api.post('/auth/register', { fullName, email, password, role }),
};

// Posts endpoints
export const postsApi = {
  getAll: () => api.get('/posts'),
  create: (content, imageUrl) => api.post('/posts', { content, imageUrl }),
};

// Messages endpoints
export const messagesApi = {
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  getContacts: () => api.get('/messages/contacts'),
};

// Resources endpoints  
export const resourcesApi = {
  getAll: () => api.get('/resources'),
  getBySubject: (subjectId) => api.get(`/resources/subject/${subjectId}`),
  getByDepartment: (deptId) => api.get(`/resources/department/${deptId}`),
  create: (data) => api.post('/resources', data),
};

// Profiles endpoints
export const profilesApi = {
  getMe: () => api.get('/profiles/me'),
  getUserProfile: (userId) => api.get(`/profiles/${userId}`),
  updateMyProfile: (data) => api.put('/profiles/me', data),
};

export default api;
