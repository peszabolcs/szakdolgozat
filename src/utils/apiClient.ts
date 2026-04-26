import axios, { AxiosError } from 'axios';

const TOKEN_KEY = 'parkvision.auth.token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export const apiClient = axios.create({
  baseURL: '/',
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      // Soft signal: route guard will redirect to /login on next render.
      window.dispatchEvent(new CustomEvent('parkvision:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const TOKEN_STORAGE_KEY = TOKEN_KEY;
