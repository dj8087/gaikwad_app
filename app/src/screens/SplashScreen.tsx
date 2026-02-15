import assets from "@/app/src/assets";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { getLoggedInUser } from "../api/profileSlice";
import useAppDispatch from "../hooks/useAppDispatch";
import useAppNavigation from "../hooks/useAppNavigation";
import { useAuthData } from "../hooks/useAuthData";
import colors from "../theme/colors";
import { hp, wp } from "../utils/common";
import { showError } from "../utils/toast";

export default function SplashScreen() {
  const navigation = useAppNavigation()
  const dispatch = useAppDispatch()
  const { token, user } = useAuthData();

  console.log("token -- " + token)
  console.log("user -- " + JSON.stringify(user))

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token && user?.id) {
        console.log("////")
        dispatch(getLoggedInUser(token))
          .unwrap()
          .then(res => {
            navigation.navigate("Dashbaord");
          })
          .catch(err => {
            showError("Invalid access token")
            navigation.navigate("Splash1");
            // navigation.navigate("AccessTokenScreen");
          });
      } else {
        console.log("????")
        // navigation.replace("AccessTokenScreen");
        navigation.replace("Splash1");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

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
