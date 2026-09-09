
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { useFonts } from "expo-font";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { getAppBaseUrl } from "./appConfig";
import { setBaseUrl } from "./src/api";
import RootNavigator from "./src/navigation/RootNavigator";
import { persistor, store } from "./src/redux/store";
import { STORAGE_KEYS } from "./src/utils/storageKeys";
import { toastConfig } from "./src/utils/toastConfig";
import { useVersionCheck } from "./src/hooks/useVersionCheck";
import UpdateModal from "./src/components/UpdateModal";
import { navigate, navigationRef } from "./src/navigation/navigationRef";
import { useAuthData } from "./src/hooks/useAuthData";
import useAppDispatch from "./src/hooks/useAppDispatch";
import { updateFcmTokenApi } from "./src/api/authSlice";
import { fetchProductDesigns, fetchDesignDetails } from "./src/api/productDesignSlice";
import { getLatestVersionApi } from "./src/api/versionSlice";

// Register background handler (must be outside of React components)
messaging().setBackgroundMessageHandler(async remoteMessage => {
});

const AppRoot = () => {
  const {
    showUpdateModal,
    versionData,
    handleUpdate,
    handleLater,
  } = useVersionCheck();

  const { token: authToken } = useAuthData();
  const dispatch = useAppDispatch();
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [activeNotification, setActiveNotification] = useState<any>(null);
  const authTokenRef = useRef(authToken);
  useEffect(() => {
    authTokenRef.current = authToken;
  }, [authToken]);

  // Helper for notification navigation
  const handleNotificationNavigation = useCallback((remoteMessage: any) => {
    if (!remoteMessage) return;

    let payload: any = remoteMessage.data || {};
    let notificationBody = remoteMessage.notification?.body || "";

    // Attempt to parse body if it arrives as JSON string payload
    try {
      const parsedBody = JSON.parse(notificationBody);
      if (parsedBody && typeof parsedBody === 'object') {
        payload = { ...payload, ...parsedBody };
      }
    } catch (error) {
      // Not JSON, ignore
    }

    const screen = payload.screen;
    const taskId = payload.taskId;

    if (screen === 'appUpdate') {
      dispatch(getLatestVersionApi({ token: authTokenRef.current || "" }));
    } else if (screen === 'ProductDetail' && taskId) {
      const productId = taskId.toString();
      dispatch(fetchDesignDetails({ productId, token: authTokenRef.current || "" }))
        .unwrap()
        .then((designRes) => {
          dispatch(fetchProductDesigns({ productId, token: authTokenRef.current || "" }))
            .unwrap()
            .then(() => {
              navigate("ProductDetail", { design: designRes });
            })
            .catch(() => {
              navigate("Home" as never); // Fallback if API fails
            });
        })
        .catch(() => {
          navigate("Home" as never); // Fallback if API fails
        });
    } else if (screen) {
      navigate(screen as never);
    } else {
      navigate("Home" as never);
    }
  }, [dispatch]);

  useEffect(() => {
    const requestPermissionAndSetup = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          if (!messaging().isDeviceRegisteredForRemoteMessages) {
            await messaging().registerDeviceForRemoteMessages();
          }

          const token = await messaging().getToken();
          const storedToken = await AsyncStorage.getItem("fcmToken");
          if (token !== storedToken) {
            await AsyncStorage.setItem("fcmToken", token);
            if (authTokenRef.current) {
              dispatch(updateFcmTokenApi({ token: authTokenRef.current, fcmToken: token }));
            }
          }
        }
      } catch (error) {
      }
    };

    requestPermissionAndSetup();

    // Handle token refresh
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
      const storedToken = await AsyncStorage.getItem("fcmToken");
      if (token !== storedToken) {
        await AsyncStorage.setItem("fcmToken", token);
        if (authTokenRef.current) {
          dispatch(updateFcmTokenApi({ token: authTokenRef.current, fcmToken: token }));
        }
      }
    });

    // Handle foreground notifications
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      let bodyText = remoteMessage.notification?.body || "";
      try {
        const parsedBody = JSON.parse(bodyText);
        if (parsedBody && parsedBody.message) {
          bodyText = parsedBody.message;
        }
      } catch (error) { }

      const processedMessage = {
        ...remoteMessage,
        notification: {
          ...remoteMessage.notification,
          body: bodyText
        }
      };
      setActiveNotification(processedMessage);
      setNotificationModalVisible(true);
    });

    // Handle notification click when app is in the background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      handleNotificationNavigation(remoteMessage);
    });

    // Handle notification click when app is completely closed (quit state)
    messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        // Small delay to ensure NavigationContainer has mounted
        setTimeout(() => handleNotificationNavigation(remoteMessage), 1500);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeTokenRefresh();
    };
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationIndependentTree>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
        </NavigationIndependentTree>
        <Toast position="bottom" config={toastConfig} />
        {versionData && (
          <UpdateModal
            visible={showUpdateModal}
            isForceUpdate={versionData.isForceUpdate}
            releaseNote={versionData.releaseNote}
            onUpdate={handleUpdate}
            onLater={handleLater}
          />
        )}
        <Modal
          visible={notificationModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setNotificationModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{activeNotification?.notification?.title || "New Notification"}</Text>
              <Text style={styles.modalBody}>{activeNotification?.notification?.body}</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setNotificationModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.openButton}
                  onPress={() => {
                    setNotificationModalVisible(false);
                    if (activeNotification) {
                      handleNotificationNavigation(activeNotification);
                    }
                  }}
                >
                  <Text style={styles.openButtonText}>Open</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}


export default function Index() {
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded] = useFonts({
    "Arimo-Regular": require("../assets/fonts/Arimo-Regular.ttf"),
    "Arimo-Bold": require("../assets/fonts/Arimo-Bold.ttf"),
    "Arimo-Medium": require("../assets/fonts/Arimo-Medium.ttf"),
    "Arimo-SemiBold": require("../assets/fonts/Arimo-SemiBold.ttf"),
  });

  useEffect(() => {
    bootstrapApp();
  }, []);

  const bootstrapApp = async () => {
    try {
      const rawBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || getAppBaseUrl();
      const baseUrl = rawBaseUrl.replace(/\/$/, "");
      const apiUrl = `${baseUrl}/v1/ajgold/site/api/`;
      setBaseUrl(apiUrl);
    } catch (error) {
      console.error("Bootstrap error:", error);
    } finally {
      setAppReady(true);
    }
  };

  if (!fontsLoaded || !appReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#FF6A00" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRoot />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalBody: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  closeButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  openButton: {
    backgroundColor: "#FF6A00",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  openButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
