import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useCallback, useRef } from "react";
import { BackHandler } from "react-native";
import { showWarning } from "./toast";

export const useAndroidBackExit = (
  message = "Press back again to exit"
) => {
  const backPressRef = useRef(0);
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      if (!isFocused) {
        return;
      }

      const onBackPress = () => {
        const now = Date.now();

        if (now - backPressRef.current < 2000) {
          BackHandler.exitApp();
          return true;
        }

        backPressRef.current = now;
        showWarning(message);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => {
        subscription.remove();
      };
    }, [isFocused, message])
  );
};
