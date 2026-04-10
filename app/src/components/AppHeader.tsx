import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import colors from "../theme/colors";
import { fonts } from "../theme/fonts";
import useAppNavigation from "../hooks/useAppNavigation";
import assets from "../assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title?: string;
  showBack?: boolean;

  // Right icons can be one or two
  rightIcon1?: string;
  rightIcon2?: string;

  onBackPress?: () => void;
  onRightPress1?: () => void;
  onRightPress2?: () => void;

  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export default function AppHeader({
  title,
  showBack = true,
  rightIcon1,
  rightIcon2,
  onBackPress,
  onRightPress1,
  onRightPress2,
  style,
  titleStyle,
}: HeaderProps) {
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const topMargin = Platform.OS === "android" ? StatusBar.currentHeight || insets.top : insets.top;
  
  return (
    <View style={[styles.header, { marginTop: topMargin }, style]}>
      <TouchableOpacity 
        style={styles.leftBox}
        onPress={showBack ? (onBackPress || (() => navigation.goBack())) : undefined}
        disabled={!showBack}
      >
        {showBack ? (
          <View style={styles.leftButton}>
            <Ionicons name="arrow-back" size={26} color={colors.darkBlue} />
          </View>
        ) : (
          <View style={{ width: 34 }} />
        )}
        <Image source={assets.images.logo} style={styles.logo} resizeMode="contain" />
      </TouchableOpacity>

      {title ? (
        <View style={styles.titleContainer} pointerEvents="none">
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      ) : (
        null
      )}

      <View style={styles.rightBox}>
        {rightIcon1 && (
          <TouchableOpacity onPress={onRightPress1} style={styles.iconButton}>
            <Ionicons name={rightIcon1 as any} size={26} color={colors.darkBlue} />
          </TouchableOpacity>
        )}

        {rightIcon2 && (
          <TouchableOpacity onPress={onRightPress2} style={styles.iconButton}>
            <Ionicons name={rightIcon2 as any} size={26} color={colors.darkBlue} />
          </TouchableOpacity>
        )}

        {!rightIcon1 && !rightIcon2 && <View style={{ width: 26 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 61,
    backgroundColor: colors.white,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    marginBottom: 11,
  },

  leftBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  leftButton: {
    width: 34,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 32,
    height: 32,
  },

  rightBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  iconButton: {
    width: 34,
    justifyContent: "center",
    alignItems: "center",
  },

  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.darkBlue,
  },
});
