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


api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;


    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {

        const { data } = await api.patch('/token/refresh');

        localStorage.setItem('token', data.token);

        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

        return api(originalRequest);
      } catch (err) {
       
        try {
          localStorage.removeItem('token');
          await api.delete('/logout');
        } finally {
          window.location.replace('/sign-in');
        }

        return Promise.reject(err);
      }
    }

    

    return Promise.reject(error);
  }
);