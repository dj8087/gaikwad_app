
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { useFonts } from "expo-font";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { CONFIG_URL } from "./appConfig";
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
  console.log('Message handled in the background!', remoteMessage);
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
        console.log("Loading product details");
      const productId = taskId.toString();
      console.log("Loading product details pdi : ", productId);
      dispatch(fetchDesignDetails({ productId, token: authTokenRef.current || "" }))
        .unwrap()
        .then((designRes) => {
          dispatch(fetchProductDesigns({ productId, token: authTokenRef.current || "" }))
            .unwrap()
            .then(() => {
              console.log("Details loaded:", designRes);
              navigate("ProductDetail", { design: designRes }); 
              console.log("Opened:", designRes);
            })
            .catch((e) => {
              console.log("Error in Images loading : ", e);
              navigate("Home" as never); // Fallback if API fails
            });
        })
        .catch(() => {
        console.log("Error in Details loading");
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
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("FCM Authorization status:", authStatus);
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        const storedToken = await AsyncStorage.getItem("fcmToken");
        //log authTokenRef
        console.log("Current auth token:", authTokenRef.current);
        if (token !== storedToken) {
          await AsyncStorage.setItem("fcmToken", token);
          if (authTokenRef.current) {
            dispatch(updateFcmTokenApi({ token: authTokenRef.current, fcmToken: token }));
          }
        }
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
      } catch (error) {}

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

    // --- SIMULATED NOTIFICATION (10 Seconds Timer) ---
    const simulationTimer = setTimeout(() => {
      const mockRemoteMessage = {
        notification: {
          title: "Simulated Notification",
          body: "Click here to test product details loading",
        },
        data: {
          screen: "ProductDetail",
          taskId: "1",
        },
      };
      console.log("1111");
      // setActiveNotification(mockRemoteMessage);
      // setNotificationModalVisible(true);
    }, 10000);

    return () => {
      unsubscribe();
      unsubscribeTokenRefresh();
      clearTimeout(simulationTimer);
    };
  }, []);

  return (
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
    console.log("Starting app bootstrap...");
    try {
      const storedConfig = await AsyncStorage.getItem(STORAGE_KEYS.APP_CONFIG);
      let baseUrl = null;
      const today = new Date().toISOString().split('T')[0];

      console.log("Attempting to get base URL from AsyncStorage...");

      if (storedConfig) {
        try {
          const { baseUrl: storedBaseUrl, date: storedDate } = JSON.parse(storedConfig);
          if (storedDate === today) {
            baseUrl = storedBaseUrl;
            console.log("Base URL found in AsyncStorage for today:", baseUrl);
          } else {
            console.log("Stored Base URL is outdated.");
          }
        } catch (e) {
          console.log('Could not parse stored config or it is outdated, will refetch.');
        }
      }

      if (!baseUrl) {
        console.log("Base URL not found for today, fetching from remote...");
        
        const response = await fetch(CONFIG_URL);

        if (!response.ok) {
          throw new Error("Config API failed");
        }
      
        const json = await response.json();
        const fetchedBaseUrl = json?.appEndpointBaseUrl;
      
        if (!fetchedBaseUrl) {
          throw new Error("appEndpointBaseUrl missing in config");
        }
        
        const newConfig = { baseUrl: fetchedBaseUrl, date: today };
        await AsyncStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(newConfig));
        baseUrl = fetchedBaseUrl;
        
        console.log("Base URL fetched and stored successfully for today.");
      }
      console.log("Setting base url:", baseUrl)
      if (baseUrl) {
        const apiUrl = `${baseUrl}/v1/ajgold/site/api/`;
        setBaseUrl(apiUrl);
        console.log("Base URL set for API:", apiUrl);
      } else {
        console.error("Could not obtain a valid base URL.");
      }

    } catch (error) {
      console.error("App bootstrap failed", error);
    } finally {
      console.log("Bootstrap process finished, setting app to ready.");
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
