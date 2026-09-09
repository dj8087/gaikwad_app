// src/api/axiosClient.ts
import axios from "axios";
import { store } from "../redux/store";
import { logout } from "./authSlice";
import { navigate } from "../navigation/navigationRef";

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
    const data = response.data;
    const isInvalidToken = data?.error_status === true && data?.code === "501" && data?.message === "Invalid customer token";

    if (response.status === 401 || isInvalidToken) {
      store.dispatch(logout());
      setTimeout(() => {
        navigate("AccessTokenScreen" as never);
      }, 100);
      return Promise.reject(new Error("Unauthorized"));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const data = error.response.data;
      const isInvalidToken = data?.error_status === true && data?.code === "501" && data?.message === "Invalid customer token";

      if (error.response.status === 401 || isInvalidToken) {
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
};

export default axiosClient;
