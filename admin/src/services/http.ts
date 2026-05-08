import axios, { type AxiosResponse } from 'axios';
import { getMessageApi } from '../lib/message-holder';
import { authStore } from '../stores/auth-store';
import { ApiResponse } from '../types/api';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000/api';

export const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  withCredentials: true, // send httpOnly cookies for same-origin requests
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const messageText = error.response?.data?.message ?? error.message ?? 'Request failed';
    const msgApi = getMessageApi();
    if (msgApi) {
      msgApi.error(messageText);
    }

    if (error.response?.status === 401) {
      authStore.clearSession();
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  },
);

export async function unwrapResponse<T>(
  input: Promise<AxiosResponse<ApiResponse<T>>> | AxiosResponse<ApiResponse<T>>,
): Promise<T> {
  const response = await Promise.resolve(input);

  if (response.data.code !== 0) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}
