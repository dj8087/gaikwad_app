// src/api/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  timeout: 30000,
});

export const setBaseUrl = (baseURL: string) => {
  axiosClient.defaults.baseURL = baseURL;
  console.log("Axios Base URL Set:", baseURL);
};

export default axiosClient;
