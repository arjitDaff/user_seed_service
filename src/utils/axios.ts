import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import logger from './logger';

// Creating axios instance
const axiosInstance: AxiosInstance = axios.create();

// Interceptors for request logging
axiosInstance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  logger.info(`Outgoing Request: Url: ${request.url}, Query: ${JSON.stringify(request.params)}`);
  return request;
});

export default axiosInstance;
