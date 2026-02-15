import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import colors from "../theme/colors";
import { fonts } from "../theme/fonts";

interface Props {
  title: string;
  onPress?: () => void;
  bg?: string;
  color?: string;
  full?: boolean;
  radius?: number;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function AppButton({
  title,
  onPress,
  bg = colors.primary,
  color = "#fff",
  full = true,
  radius = 14,
  disabled = false,
  style,
  textStyle,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={!disabled ? onPress : undefined}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? "red" : bg,
          borderRadius: radius,
          width: full ? "80%" : undefined,
          alignSelf:"center",
          marginTop : 20
        },
        style,
      ]}
    >
      <Text
        style={[
          { color, fontFamily: fonts.medium },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },

});
