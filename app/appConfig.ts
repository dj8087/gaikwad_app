export const DEFAULT_BASE_URL = "https://api.ajgold.in";

export const getAppBaseUrl = (): string => {
  return DEFAULT_BASE_URL.replace(/\/$/, "");
};
