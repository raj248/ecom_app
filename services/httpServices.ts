// import 'dotenv/config';
// httpService.ts
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';

console.log('Base url: ', Constants.expoConfig?.extra?.BASE_URL);
const instance = axios.create({
  baseURL: Constants.expoConfig?.extra?.BASE_URL, // <-- set this in app.config.js
  timeout: 50000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Set token for auth
export const setToken = (token?: string) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

// Request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('➡️ HTTP Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('❌ HTTP Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('⬅️ HTTP Response:', {
      url: response.config.url,
      status: response.status,
      dataLength: response.data.length,
    });
    return response;
  },
  (error) => {
    console.error('❌ HTTP Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.get<T>(url, config).then(responseBody),
  post: <T>(url: string, body?: any, config?: AxiosRequestConfig) =>
    instance.post<T>(url, body, config).then(responseBody),
  put: <T>(url: string, body?: any, config?: AxiosRequestConfig) =>
    instance.put<T>(url, body, config).then(responseBody),
};

export default requests;
