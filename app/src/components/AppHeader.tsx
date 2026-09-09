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
  showLogo?: boolean;

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
  showLogo = false,
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
  const topPadding = Platform.OS === "android" ? StatusBar.currentHeight || insets.top : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPadding }, style]}>
      <View style={styles.content}>
        <View style={styles.leftBox}>
          {showBack ? (
            <TouchableOpacity
              style={styles.leftButton}
              onPress={onBackPress || (() => navigation.goBack())}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.darkBlue} />
            </TouchableOpacity>
          ) : null}

          {showLogo ? (
            <Image source={assets.images.logo} style={styles.logo} resizeMode="contain" />
          ) : null}

          {!showBack && !showLogo ? <View style={{ width: 34 }} /> : null}
        </View>

        {title ? (
          <View style={styles.titleContainer}>
            <Text style={[styles.title, titleStyle]} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <View style={styles.rightBox}>
          {rightIcon1 && (
            <TouchableOpacity onPress={onRightPress1} style={styles.iconButton}>
              <Ionicons name={rightIcon1 as any} size={24} color={colors.darkBlue} />
            </TouchableOpacity>
          )}

          {rightIcon2 && (
            <TouchableOpacity onPress={onRightPress2} style={styles.iconButton}>
              <Ionicons name={rightIcon2 as any} size={24} color={colors.darkBlue} />
            </TouchableOpacity>
          )}

          {!rightIcon1 && !rightIcon2 && <View style={{ width: 34 }} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  content: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },

  leftBox: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 34,
  },

  leftButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 30,
    height: 30,
  },

  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.darkBlue,
    textAlign: "center",
  },

  rightBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 34,
    gap: 11,
  },

  iconButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
});
