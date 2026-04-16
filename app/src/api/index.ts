// src/api/axiosClient.ts
import axios from "axios";
import { store } from "../redux/store";
import { logout } from "./authSlice";
import { navigate } from "../navigation/navigationRef";

const axiosClient = axios.create({
  timeout: 30000,
});

// --- REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  (config) => {
    // Add your custom header to every outgoing request
    config.headers["X-Custom-Header"] = "MyCustomHeaderValue";

    // Parse/Review the outgoing request
    console.log(`[Axios Request] ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR ---
axiosClient.interceptors.response.use(
  (response) => {
    // Review response headers on successful requests
    console.log(`[Axios Response] ${response.config.url} - Status: ${response.status}`);
    console.log(`[Axios Response Headers] ${response.config.url}:`, response.headers);

    const data = response.data;
    const isInvalidToken = data?.error_status === true && data?.code === "501" && data?.message === "Invalid customer token";

    if (response.status === 401 || isInvalidToken) {
      console.warn("Unauthorized access detected. Logging out...");
      store.dispatch(logout());
      setTimeout(() => {
        navigate("AccessTokenScreen" as never);
      }, 100);
      return Promise.reject(new Error("Unauthorized"));
    }
    return response;
  },
  (error) => {
    // Review response headers on failed requests (e.g., 400, 401, 500)
    if (error.response) {
      console.error(`[Axios Error] ${error.config?.url} - Status: ${error.response.status}`);
      console.error(`[Axios Error Headers] ${error.config?.url}:`, error.response.headers);
      
      const data = error.response.data;
      const isInvalidToken = data?.error_status === true && data?.code === "501" && data?.message === "Invalid customer token";

      if (error.response.status === 401 || isInvalidToken) {
        console.warn("Unauthorized access detected. Logging out...");
        store.dispatch(logout());
        setTimeout(() => {
          navigate("AccessTokenScreen" as never);
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export const setBaseUrl = (baseURL: string) => {
  axiosClient.defaults.baseURL = baseURL;
  console.log("Axios Base URL Set:", baseURL);
};

export default axiosClient;
