// src/api/axiosClient.ts
import axios from "axios";

const rawBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.ajgold.in";
const defaultApiUrl = `${rawBaseUrl.replace(/\/$/, "")}/v1/ajgold/site/api/`;

const axiosClient = axios.create({
  baseURL: defaultApiUrl,
  timeout: 30000,
});

// --- REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR ---
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setBaseUrl = (baseURL: string) => {
  axiosClient.defaults.baseURL = baseURL;
};

export default axiosClient;
