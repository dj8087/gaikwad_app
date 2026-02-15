import { fonts } from "@/app/src/theme/fonts";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  title: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  linkStyle?: TextStyle;
}

export default function SeeAllHeader({
  title,
  onPress,
  containerStyle,
  titleStyle,
  linkStyle,
}: Props) {
  return (
    <View style={[styles.row, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>

      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.link, linkStyle]}>See All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 6,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
  },
  link: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: "#FF6A00",
  },
});
