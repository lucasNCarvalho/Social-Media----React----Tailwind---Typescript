import { env } from '@/env'
import axios from 'axios'

export const api = axios.create({
  baseURL:  env.VITE_LOOMY_API_URL,
  withCredentials: true
})


api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');


    if (token) {
      
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await api.patch("/token/refresh");

          localStorage.setItem("token", data.token);
          api.defaults.headers.common["Authorization"] = "Bearer " + data.token;
          originalRequest.headers["Authorization"] = "Bearer " + data.token;
          processQueue(null, data.token);
          resolve(api(originalRequest));
        } catch (err) {
          processQueue(err, null);
          try {
            localStorage.removeItem("token");
            await api.delete("/logout");
          } finally {
            window.location.replace("/sign-in");
          }
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  }
);
