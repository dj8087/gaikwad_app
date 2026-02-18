import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { fetchAndStoreBaseUrl } from "./appConfig";
import { setBaseUrl } from "./src/api";
import RootNavigator from "./src/navigation/RootNavigator";
import { persistor, store } from "./src/redux/store";
import { STORAGE_KEYS } from "./src/utils/storageKeys";
import { toastConfig } from "./src/utils/toastConfig";

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
      let baseUrl = 'http://192.168.1.24:3880' //await AsyncStorage.getItem(STORAGE_KEYS.APP_CONFIG);
      console.log("Attempting to get base URL from AsyncStorage...");

      if (!baseUrl) {
        console.log("Base URL not found in AsyncStorage, fetching from remote...");
        baseUrl = await fetchAndStoreBaseUrl();
        console.log("Base URL fetched and stored successfully.");
      } else {
        console.log("Base URL found in AsyncStorage:", baseUrl);
      }

      const apiUrl = `${baseUrl}/v1/ajgold/site/api/`;
      setBaseUrl(apiUrl);
      console.log("Base URL set for API:", apiUrl);

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootNavigator />
          <Toast position="bottom" config={toastConfig} />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
