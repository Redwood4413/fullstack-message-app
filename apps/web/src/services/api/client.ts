import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { AUTH_REFRESH } from './endpoints';

export const client = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_BACKEND_URL : '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;
    if (error.response?.status === 401 && originalRequest?.url !== AUTH_REFRESH) {
      try {
        await client.post(AUTH_REFRESH, {}, { withCredentials: true });
        return client(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
