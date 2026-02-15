import { Dimensions, Platform } from "react-native";
import api from "../api";

const { width, height } = Dimensions.get("window");

// 👉 Screen dimensions
export const screenWidth = width;
export const screenHeight = height;

// 👉 Convert % → actual width
export const wp = (percent: number) => (screenWidth * percent) / 100;

// 👉 Convert % → actual height
export const hp = (percent: number) => (screenHeight * percent) / 100;

// 👉 Check iOS / Android
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

// 👉 Delay / wait utility
export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

// 👉 Random ID generator
export const uuid = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

// 👉 Check empty string or null
export const isEmpty = (value: any) =>
  value === null ||
  value === undefined ||
  (typeof value === "string" && value.trim() === "");

// 👉 Capitalize first letter
export const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export const getBaseUrl = () => api.defaults.baseURL;

