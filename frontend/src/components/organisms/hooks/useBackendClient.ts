import axios, { AxiosInstance } from 'axios';
import { useMemo } from 'react';
import { useAuth } from '../AuthContext';

const isProtectedApiPath = (path?: string): boolean => {
  return !!path && !path?.startsWith('/api/stats');
};

/**
 * Backend http client that resets auth context state if 401 http response
 * is received.
 */
export const useBackendClient = (): AxiosInstance => {
  const { reset } = useAuth();

  return useMemo(() => {
    // This client is scoped to our backend using baseURL
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BACK_HOST,
    });

    axiosInstance.interceptors.request.use((config) => {
      if (isProtectedApiPath(config.url)) {
        config.withCredentials = true;
      }

      return config;
    });

    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          reset();
        }

        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }, [reset]);
};
