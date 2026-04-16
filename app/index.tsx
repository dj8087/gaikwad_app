
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { useFonts } from "expo-font";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
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
import { navigate } from "./src/navigation/navigationRef";
import { useAuthData } from "./src/hooks/useAuthData";
import useAppDispatch from "./src/hooks/useAppDispatch";
import { updateFcmTokenApi } from "./src/api/authSlice";
import { fetchProductDesigns } from "./src/api/productDesignSlice";
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

  const authTokenRef = useRef(authToken);
  useEffect(() => {
    authTokenRef.current = authToken;
  }, [authToken]);

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

    // Helper for notification navigation
    const handleNotificationNavigation = (remoteMessage: any) => {
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
        dispatch(fetchProductDesigns({ productId, token: authTokenRef.current || "" }))
          .unwrap()
          .then(() => {
            navigate("ProductDetail" as never, { design: { id: productId, name: "Product Details" } } as never);
          })
          .catch(() => {
            navigate("Home" as never); // Fallback if API fails
          });
      } else if (screen) {
        navigate(screen as never);
      } else {
        navigate("Home" as never);
      }
    };

    // Handle foreground notifications
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      let bodyText = remoteMessage.notification?.body || "";
      try {
        const parsedBody = JSON.parse(bodyText);
        if (parsedBody && parsedBody.message) {
          bodyText = parsedBody.message;
        }
      } catch (error) {}

      Toast.show({
        type: "success",
        text1: remoteMessage.notification?.title || "New Notification",
        text2: bodyText,
        onPress: () => {
          handleNotificationNavigation(remoteMessage);
          Toast.hide();
        },
      });
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigator />
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
