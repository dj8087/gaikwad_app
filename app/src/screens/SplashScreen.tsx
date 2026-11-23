import assets from "@/app/src/assets";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { CUSTOMER_TOKEN_KEY, restoreCustomerToken } from "../api/authSlice";
import useAppNavigation from "../hooks/useAppNavigation";
import colors from "../theme/colors";
import { hp, wp } from "../utils/common";
import { AppDispatch } from "../redux/store";
import { showError } from "../utils/toast";

export default function SplashScreen() {
  const navigation = useAppNavigation()
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const customerToken = await SecureStore.getItemAsync(CUSTOMER_TOKEN_KEY);
        if (!active) {
          return;
        }

        if (customerToken) {
          dispatch(restoreCustomerToken(customerToken));
          navigation.replace("ProductTypeSelection");
        } else {
          navigation.replace("AccessCode");
        }
      } catch {
        if (active) {
          navigation.replace("AccessCode");
          showError("Unable to restore catalogue access. Please enter your access code again.");
        }
      }
    }, 2000);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={assets.images.logoGif}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: wp(80),
    height: hp(50),
  },
});
