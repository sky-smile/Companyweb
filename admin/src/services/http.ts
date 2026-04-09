import axios from 'axios';
import { message } from 'antd';
import { authStore } from '../stores/auth-store';
import { ApiResponse } from '../types/api';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000/api';

export const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = authStore.getAccessToken();

  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const messageText = error.response?.data?.message ?? error.message ?? 'Request failed';
    message.error(messageText);

    if (error.response?.status === 401) {
      authStore.clearSession();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export async function unwrapResponse<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await promise;

  if (response.data.code !== 0) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}
