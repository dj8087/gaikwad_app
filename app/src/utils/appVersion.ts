import { nativeApplicationVersion } from "expo-application";
import Constants from "expo-constants";

const nativeAppVersion =
  nativeApplicationVersion ?? Constants.expoConfig?.version ?? "Unknown";

export const appVersion = /^\d+\.\d+$/.test(nativeAppVersion)
  ? `${nativeAppVersion}.0`
  : nativeAppVersion;
