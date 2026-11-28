// src/api/axiosClient.ts
import axios, { type AxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import { appVersion } from "../utils/appVersion";

const rawBaseUrl = "https://api.ajgold.in";
const defaultApiUrl = `${rawBaseUrl.replace(/\/$/, "")}/v1/ajgold/site/api/`;

const axiosClient = axios.create({
  baseURL: defaultApiUrl,
  timeout: 30000,
});

let customerToken: string | null = null;

export const setCustomerToken = (token: string | null) => {
  customerToken = token;
};

// --- REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  (config) => {
    config.headers.set("X-App-Version", appVersion);
    config.headers.set("X-App-Platform", Platform.OS);

    if (customerToken && config.headers.get("token") !== null) {
      config.headers.set("token", customerToken);
    }
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

export const getPublic = <T>(
  url: string,
  config: AxiosRequestConfig = {}
) => {
  const headers = { ...config.headers, token: null };
  return axiosClient.get<T>(url, { ...config, headers });
};

export default axiosClient;
