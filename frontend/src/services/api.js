import axios from 'axios';
 
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api';
 
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Product endpoints
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query) => api.get('/products/search', { params: { q: query } }),
};

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verifyLoginOtp: (data) => api.post('/auth/login/verify', data),
  register: (data) => api.post('/auth/register', data),
  verifyOtp: (data) => api.post('/auth/register/verify', data),
  requestForgotPasswordOtp: (data) => api.post('/auth/forgot-password/request-otp', data),
  resetPasswordWithOtp: (data) => api.post('/auth/forgot-password/reset', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  verifyToken: () => api.get('/auth/verify'),
};

// Cart endpoints
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity) => api.post('/cart/items', { productId, quantity }),
  updateItem: (productId, quantity) => api.put(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.delete('/cart'),
};

// Order endpoints
export const orderAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
};

// Shop Details & Store Info endpoints
export const shopAPI = {
  getDetails: () => api.get('/shop/details'),
  updateDetails: (data) => api.put('/admin/shop/details', data),
};

// AI Assistant & RAG endpoints
export const aiAPI = {
  ask: (question) => api.post('/ai/ask', { question }),
  getKnowledge: () => api.get('/admin/ai/knowledge'),
  saveKnowledge: (data) => api.post('/admin/ai/knowledge', data),
  deleteKnowledge: (id) => api.delete(`/admin/ai/knowledge/${id}`),
  syncEmbeddings: () => api.post('/admin/ai/sync-embeddings'),
};

// Comparison endpoints
export const comparisonAPI = {
  compareWithAi: (arg1, arg2, arg3) => {
    if (Array.isArray(arg1)) {
      return api.post('/products/ai-compare', { productIds: arg1 });
    }
    const ids = [arg1, arg2, arg3].filter(Boolean);
    return api.post('/products/ai-compare', { productIds: ids, productId1: arg1, productId2: arg2, productId3: arg3 });
  },
};

// Reviews & Ratings endpoints
export const reviewAPI = {
  submit: (data) => api.post('/reviews', data),
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  getFeatured: () => api.get('/reviews/featured'),
  getUserReviews: (email) => api.get('/reviews/user', { params: { email } }),
  getAllForAdmin: () => api.get('/admin/reviews'),
  updateStatus: (id, status, notes) => api.put(`/admin/reviews/${id}/status`, { status, notes }),
  delete: (id) => api.delete(`/admin/reviews/${id}`),
};

export default api;

