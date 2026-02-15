import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import axiosClient from "../api";
import { getLoggedInUser } from "../api/profileSlice";
import useAppDispatch from "../hooks/useAppDispatch";
import useAppNavigation from "../hooks/useAppNavigation";
import { useAuthData } from "../hooks/useAuthData";
import colors from "../theme/colors";
import { hp, wp } from "../utils/common";

export default function SplashScreen1() {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const { token, user } = useAuthData();

  const [baseUrl, setBaseUrl] = useState<any | null>(null);

  // Load config
  useEffect(() => {
    const loadConfig = async () => {
      const config = await axiosClient.defaults.baseURL
      setBaseUrl(config);
    };
    loadConfig();
  }, []);

  // Splash timer + navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (token && user?.id) {
        dispatch(getLoggedInUser(token))
          .unwrap()
          .then(() => {
            navigation.replace("Dashbaord");
          })
          .catch(() => {
            navigation.replace("AccessTokenScreen");
          });
      } else {
        navigation.replace("AccessTokenScreen");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [token, user, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>My App Endpoint</Text>
      {baseUrl && (
        <Text style={styles.tagline} numberOfLines={1}>
          {baseUrl}
        </Text>
      )}
      <ActivityIndicator
        size="large"
        color="#fff"
        style={{ marginTop: hp(3) }}
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
    paddingHorizontal: wp(5),
  },
  appName: {
    fontSize: hp(4),
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  tagline: {
    marginTop: hp(1),
    fontSize: hp(1.5),
    color: "#EAEAEA",
  },
  baseUrlText: {
    position: "absolute",
    bottom: hp(4),
    fontSize: hp(1.5),
    color: "#ddd",
  },
});
