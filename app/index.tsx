
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";

import { getAppBaseUrl } from "./appConfig";
import { setBaseUrl } from "./src/api";
import RootNavigator from "./src/navigation/RootNavigator";
import { store } from "./src/redux/store";
import { toastConfig } from "./src/utils/toastConfig";
import { navigationRef } from "./src/navigation/navigationRef";

const AppRoot = () => {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationIndependentTree>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
        </NavigationIndependentTree>
        <Toast position="bottom" config={toastConfig} />
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
      <AppRoot />
    </Provider>
  );
}
