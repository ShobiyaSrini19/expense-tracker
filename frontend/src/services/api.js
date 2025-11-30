import axios from 'axios';

const API_URL = '/api/expenses';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

export const expenseAPI = {
  // Get all expenses
  getAll: () => api.get(API_URL),
  
  // Get single expense
  get: (id) => api.get(`${API_URL}/${id}`),
  
  // Create new expense
  create: (expenseData) => api.post(API_URL, expenseData),
  
  // Update expense
  update: (id, expenseData) => api.put(`${API_URL}/${id}`, expenseData),
  
  // Delete expense
  delete: (id) => api.delete(`${API_URL}/${id}`),
};

export default api;