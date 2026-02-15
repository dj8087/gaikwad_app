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
    try {
      let baseUrl = await AsyncStorage.getItem(STORAGE_KEYS.APP_CONFIG);

      if (!baseUrl) {
        baseUrl = await fetchAndStoreBaseUrl();
      }

      setBaseUrl(baseUrl + "/v1/ajgold/site/api/");

    } catch (error) {
      console.log("App bootstrap failed", error);
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
