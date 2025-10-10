// src/services/authService.ts
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const login = async (username: string, password: string) => {
  const res = await axios.post(`${API_BASE}/auth/token/`, { username, password });
  const { access, refresh } = res.data;
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
