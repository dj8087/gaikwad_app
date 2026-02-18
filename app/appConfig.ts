// src/services/appConfigService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./src/utils/storageKeys";

const CONFIG_URL = "https://ajgold.in/configs/app/config.json";

export const fetchAndStoreBaseUrl = async (): Promise<string> => {
  console.log("Fetching app configuration from:", CONFIG_URL);
  const response = await fetch(CONFIG_URL);

  if (!response.ok) {
    console.error("Failed to fetch app configuration. Status:", response.status);
    throw new Error("Config API failed");
  }

  console.log("App configuration fetched successfully. Parsing JSON...");
  const json = await response.json();
  const baseUrl = json?.appEndpointBaseUrl;
  console.log("Parsed base URL from config:", baseUrl);
  // const baseUrl = 'http://192.168.1.5';

  if (!baseUrl) {
    console.error("appEndpointBaseUrl missing in the fetched configuration.");
    throw new Error("appEndpointBaseUrl missing in config");
  }

  // ✅ Store ONLY baseURL
  console.log("Storing base URL to AsyncStorage:", baseUrl);
  await AsyncStorage.setItem(STORAGE_KEYS.APP_CONFIG, baseUrl);
  console.log("Base URL stored successfully.");

  return baseUrl;
};
