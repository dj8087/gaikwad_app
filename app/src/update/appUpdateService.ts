import { Platform } from "react-native";
import { getAppBaseUrl } from "../../appConfig";
import { getPublic } from "../api";
import { appVersion } from "../utils/appVersion";
import { compareVersions } from "../utils/compareVersions";

interface UpdatePolicyResponse {
  enabled: boolean;
  latestVersion: string;
  minimumSupportedVersion: string;
  storeUrl: string;
  message?: string;
}

type AppPlatform = "ios" | "android";

export interface AppUpdatePolicy {
  latestVersion: string;
  mandatory: boolean;
  message: string;
  storeUrl: string;
}

const isStoreListingUrl = (value: string, platform: AppPlatform): boolean => {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port
  ) {
    return false;
  }

  if (platform === "ios") {
    return (
      (url.hostname === "apps.apple.com" ||
        url.hostname === "itunes.apple.com") &&
      /\/app\/(?:[^/]+\/)?id\d+$/.test(url.pathname)
    );
  }

  return (
    url.hostname === "play.google.com" &&
    url.pathname === "/store/apps/details" &&
    Boolean(url.searchParams.get("id"))
  );
};

function isUpdatePolicyResponse(
  value: unknown
): value is UpdatePolicyResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const policy = value as Record<string, unknown>;
  return (
    typeof policy.enabled === "boolean" &&
    typeof policy.latestVersion === "string" &&
    typeof policy.minimumSupportedVersion === "string" &&
    typeof policy.storeUrl === "string" &&
    (policy.message === undefined || typeof policy.message === "string")
  );
}

export async function fetchAppUpdatePolicy(): Promise<AppUpdatePolicy | null> {
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return null;
  }

  const platform: AppPlatform = Platform.OS;
  const currentVersion = appVersion;
  console.info("[AppUpdate] Resolved installed app version.", {
    currentVersion,
  });

  if (
    !currentVersion ||
    compareVersions(currentVersion, currentVersion) === null
  ) {
    console.warn("[AppUpdate] Skipping policy check: invalid app version.", {
      platform,
      currentVersion,
    });
    throw new Error("The installed app version is missing or invalid.");
  }

  const url = `${getAppBaseUrl()}/api/app/update-policy`;
  const params = { platform, currentVersion };
  console.info("[AppUpdate] Checking update policy.", {
    method: "GET",
    url,
    params,
    timeoutMs: 8000,
  });

  const response = await getPublic<unknown>(url, {
    timeout: 8000,
    params,
  });
  console.info("[AppUpdate] Update policy response.", response.data);

  if (!isUpdatePolicyResponse(response.data)) {
    throw new Error("The app update policy response is invalid.");
  }

  const policy = response.data;
  if (!policy.enabled) {
    console.info("[AppUpdate] Update decision.", {
      currentVersion,
      enabled: false,
      showPrompt: false,
    });
    return null;
  }

  const latestComparison = compareVersions(
    currentVersion,
    policy.latestVersion
  );
  const minimumComparison = compareVersions(
    currentVersion,
    policy.minimumSupportedVersion
  );
  const policyRangeComparison = compareVersions(
    policy.minimumSupportedVersion,
    policy.latestVersion
  );

  if (
    latestComparison === null ||
    minimumComparison === null ||
    policyRangeComparison === null ||
    policyRangeComparison > 0
  ) {
    throw new Error("The app update policy contains invalid versions.");
  }

  if (latestComparison >= 0) {
    console.info("[AppUpdate] Update decision.", {
      currentVersion,
      latestVersion: policy.latestVersion,
      minimumSupportedVersion: policy.minimumSupportedVersion,
      mandatory: false,
      showPrompt: false,
      reason: "current-version-is-current",
    });
    return null;
  }

  if (!isStoreListingUrl(policy.storeUrl, platform)) {
    throw new Error("The app update policy contains an invalid store URL.");
  }

  const updatePolicy = {
    latestVersion: policy.latestVersion,
    mandatory: minimumComparison < 0,
    message:
      policy.message?.trim() || "A newer version of AJ Gold is available.",
    storeUrl: policy.storeUrl,
  };
  console.info("[AppUpdate] Update decision.", {
    currentVersion,
    latestVersion: policy.latestVersion,
    minimumSupportedVersion: policy.minimumSupportedVersion,
    mandatory: updatePolicy.mandatory,
    showPrompt: true,
    storeUrl: updatePolicy.storeUrl,
    message: updatePolicy.message,
  });
  return updatePolicy;
}
