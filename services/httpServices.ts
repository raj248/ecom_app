// httpService.ts
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('Base url: ', Constants.expoConfig?.extra?.BASE_URL);

const instance = axios.create({
  baseURL: Constants.expoConfig?.extra?.BASE_URL,
  timeout: 50000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Set token for auth
export const setToken = async (token?: string) => {
  if (token) {
    await AsyncStorage.setItem('token', token);
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    await AsyncStorage.removeItem('token');
    delete instance.defaults.headers.common['Authorization'];
  }
};

// Load token on startup
(async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
})();

// Request interceptor
instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

// Flag to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('⬅️ HTTP Response:', {
      url: response.config.url,
      status: response.status,
      dataLength: response.data?.length,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token found');

        const res = await axios.post(`${Constants.expoConfig?.extra?.BASE_URL}/customer/refresh`, {
          refreshToken,
        });

        const newToken = res.data?.accessToken;
        await AsyncStorage.setItem('token', newToken);

        instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

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
