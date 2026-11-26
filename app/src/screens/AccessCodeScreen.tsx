import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { authenticateAccessCode } from "../api/authSlice";
import AppButton from "../components/AppButton";
import useAppDispatch from "../hooks/useAppDispatch";
import useAppNavigation from "../hooks/useAppNavigation";
import { RootState } from "../redux/store";
import colors from "../theme/colors";
import { fonts } from "../theme/fonts";
import { showError, showWarning } from "../utils/toast";

export default function AccessCodeScreen() {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const [accessCode, setAccessCode] = useState("");

  const handleContinue = async () => {
    const code = accessCode.trim();
    if (!code || loading) {
      return;
    }

    let fcmToken: string | null = null;
    let notificationWarning: string | null = null;

    if (Platform.OS === "ios" || Platform.OS === "android") {
      try {
        const {
          AuthorizationStatus,
          getMessaging,
          getToken,
          isDeviceRegisteredForRemoteMessages,
          registerDeviceForRemoteMessages,
          requestPermission,
        } = await import("@react-native-firebase/messaging");
        const messagingInstance = getMessaging();
        let permissionGranted = true;

        if (Platform.OS === "ios") {
          const status = await requestPermission(messagingInstance);
          permissionGranted =
            status === AuthorizationStatus.AUTHORIZED ||
            status === AuthorizationStatus.PROVISIONAL;
          if (permissionGranted && !isDeviceRegisteredForRemoteMessages(messagingInstance)) {
            await registerDeviceForRemoteMessages(messagingInstance);
          }
        } else if (Number(Platform.Version) >= 33) {
          const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: "Allow notifications",
              message: "Notifications help keep you updated about the AJ Gold catalogue.",
              buttonPositive: "Allow",
              buttonNegative: "Not now",
            }
          );
          permissionGranted = status === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (permissionGranted) {
          fcmToken = await getToken(messagingInstance);
          if (__DEV__) {
            console.log(`${Platform.OS} FCM token:`, fcmToken);
          }
        } else {
          notificationWarning = "Notifications are disabled. You can enable them in Settings.";
        }
      } catch {
        notificationWarning = "Could not enable notifications. You can continue without them.";
      }
    }

    try {
      await dispatch(
        authenticateAccessCode({
          accessCode: code,
          fcmToken:
            Platform.OS === "ios" || Platform.OS === "android"
              ? fcmToken
              : undefined,
        })
      ).unwrap();
      navigation.replace("ProductTypeSelection");
      if (notificationWarning) {
        showWarning(notificationWarning);
      }
    } catch (error) {
      showError(typeof error === "string" ? error : "Unable to verify the access code.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="key-outline" size={34} color={colors.roseGold} />
        </View>
        <Text style={styles.title}>Access the AJ Gold catalogue</Text>
        <Text style={styles.description}>
          Enter the customer access code provided by AJ Gold to browse its jewellery catalogue.
        </Text>

        <Text style={styles.label}>Customer access code</Text>
        <TextInput
          accessibilityLabel="Customer access code"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          onChangeText={setAccessCode}
          onSubmitEditing={handleContinue}
          placeholder="Enter your access code"
          placeholderTextColor={colors.muted}
          returnKeyType="done"
          style={styles.input}
          value={accessCode}
        />

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <AppButton
            title="Continue to catalogue"
            onPress={handleContinue}
            disabled={!accessCode.trim()}
            style={styles.button}
          />
        )}

        <Text style={styles.helpText}>
          Need an access code? Please contact AJ Gold.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 24,
  },
  content: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    color: colors.darkBlue,
    fontFamily: fonts.bold,
    fontSize: 24,
    textAlign: "center",
  },
  description: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 32,
  },
  label: {
    color: colors.darkBlue,
    fontFamily: fonts.medium,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderRadius: 10,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
  loader: {
    marginTop: 30,
  },
  helpText: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 24,
  },
});
