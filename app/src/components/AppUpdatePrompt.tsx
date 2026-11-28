import React, { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppButton from "./AppButton";
import colors from "../theme/colors";
import { fonts } from "../theme/fonts";
import type { AppUpdatePolicy } from "../update/appUpdateService";

interface AppUpdatePromptProps {
  policy: AppUpdatePolicy | null;
  onLater: () => void;
}

export default function AppUpdatePrompt({
  policy,
  onLater,
}: AppUpdatePromptProps) {
  const [openingStore, setOpeningStore] = useState(false);

  if (!policy) {
    return null;
  }

  const openStore = async () => {
    if (openingStore) {
      return;
    }

    setOpeningStore(true);
    try {
      await Linking.openURL(policy.storeUrl);
    } catch (error) {
      console.warn("Unable to open the app store listing.", error);
      Alert.alert(
        "Unable to open the store",
        "Please try again later or open your device's app store."
      );
    } finally {
      setOpeningStore(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible
      statusBarTranslucent
      onRequestClose={policy.mandatory ? () => undefined : onLater}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>
            {policy.mandatory ? "Update required" : "Update available"}
          </Text>
          <Text style={styles.message}>{policy.message}</Text>
          <Text style={styles.version}>Version {policy.latestVersion}</Text>
          <AppButton
            title={openingStore ? "Opening..." : "Update"}
            onPress={openStore}
            disabled={openingStore}
            style={styles.updateButton}
            textStyle={styles.buttonText}
          />
          {!policy.mandatory ? (
            <AppButton
              title="Later"
              onPress={onLater}
              bg={colors.cream}
              color={colors.primary}
              style={styles.laterButton}
              textStyle={styles.buttonText}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    padding: 24,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: 21,
    textAlign: "center",
  },
  message: {
    marginTop: 14,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
  },
  version: {
    marginTop: 10,
    color: colors.muted,
    fontFamily: fonts.medium,
    fontSize: 14,
    textAlign: "center",
  },
  updateButton: {
    width: "100%",
    marginTop: 24,
  },
  laterButton: {
    width: "100%",
    marginTop: 12,
  },
  buttonText: {
    fontFamily: fonts.semi,
    fontSize: 16,
  },
});
