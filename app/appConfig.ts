import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./src/utils/storageKeys";

export const DEFAULT_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.ajgold.in";

export const getAppBaseUrl = (): string => {
  return DEFAULT_BASE_URL.replace(/\/$/, "");
};

export const fetchAndStoreBaseUrl = async (): Promise<string> => {
  const baseUrl = getAppBaseUrl();
  await AsyncStorage.setItem(STORAGE_KEYS.APP_CONFIG, baseUrl);
  return baseUrl;
};
