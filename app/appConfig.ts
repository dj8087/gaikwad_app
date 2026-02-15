// src/services/appConfigService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./src/utils/storageKeys";

const CONFIG_URL = "https://ajgold.in/configs/app/config.json";

export const fetchAndStoreBaseUrl = async (): Promise<string> => {
  const response = await fetch(CONFIG_URL);

  if (!response.ok) {
    throw new Error("Config API failed");
  }

  const json = await response.json();
  const baseUrl = json?.appEndpointBaseUrl;
  // const baseUrl = 'http://192.168.1.5';

  if (!baseUrl) {
    throw new Error("appEndpointBaseUrl missing in config");
  }

  // ✅ Store ONLY baseURL
  await AsyncStorage.setItem(STORAGE_KEYS.APP_CONFIG, baseUrl);

  return baseUrl;
};
