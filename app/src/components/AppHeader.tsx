import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import colors from "../theme/colors";
import { fonts } from "../theme/fonts";

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
  return (
    <View style={[styles.header, style]}>
      {showBack ? (
        <TouchableOpacity onPress={onBackPress} style={styles.leftButton}>
          <Ionicons name="arrow-back" size={24} color={colors.darkBlue} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}

      {title ? (
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View />
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

        {!rightIcon1 && !rightIcon2 && <View style={{ width: 24 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: colors.white,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    justifyContent: "space-between",
    marginBottom: 10,
  },

  leftButton: {
    width: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  rightBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconButton: {
    width: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.darkBlue,
  },
});
