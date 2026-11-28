import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus, Platform } from "react-native";
import {
  fetchAppUpdatePolicy,
  type AppUpdatePolicy,
} from "./appUpdateService";

const OPTIONAL_DISMISSED_VERSION_KEY = "aj_gold_dismissed_update_version";
const CHECK_COOLDOWN_MS = 30_000;

export default function useAppUpdateCheck() {
  const [policy, setPolicy] = useState<AppUpdatePolicy | null>(null);
  const inFlight = useRef(false);
  const lastCheckAt = useRef(0);
  const mounted = useRef(false);

  const checkForUpdate = useCallback(async () => {
    if (
      (Platform.OS !== "ios" && Platform.OS !== "android") ||
      inFlight.current ||
      Date.now() - lastCheckAt.current < CHECK_COOLDOWN_MS
    ) {
      return;
    }

    inFlight.current = true;
    lastCheckAt.current = Date.now();
    try {
      const nextPolicy = await fetchAppUpdatePolicy();
      if (!mounted.current) {
        return;
      }

      if (!nextPolicy) {
        setPolicy(null);
        return;
      }

      if (!nextPolicy.mandatory) {
        const dismissedVersion = await SecureStore.getItemAsync(
          OPTIONAL_DISMISSED_VERSION_KEY
        );
        if (!mounted.current) {
          return;
        }
        if (dismissedVersion === nextPolicy.latestVersion) {
          setPolicy(null);
          return;
        }
      }

      setPolicy(nextPolicy);
    } catch (error) {
      console.warn("Unable to check for an app update.", error);
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void checkForUpdate();

    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "active") {
          void checkForUpdate();
        }
      }
    );

    return () => {
      mounted.current = false;
      subscription.remove();
    };
  }, [checkForUpdate]);

  const dismissOptionalUpdate = useCallback(async () => {
    if (!policy || policy.mandatory) {
      return;
    }

    setPolicy(null);
    try {
      await SecureStore.setItemAsync(
        OPTIONAL_DISMISSED_VERSION_KEY,
        policy.latestVersion
      );
    } catch (error) {
      console.warn("Unable to save the dismissed app update.", error);
    }
  }, [policy]);

  return { policy, dismissOptionalUpdate };
}
