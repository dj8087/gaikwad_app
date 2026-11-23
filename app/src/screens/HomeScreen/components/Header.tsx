import { Ionicons } from "@expo/vector-icons";
import { fonts } from "@/app/src/theme/fonts";
import React from "react";
import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAppNavigation from "@/app/src/hooks/useAppNavigation";
import colors from "@/app/src/theme/colors";

export default function Header() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "android" ? (StatusBar.currentHeight || insets.top) + 4 : insets.top + 4;
  const navigation = useAppNavigation();

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <View>
        <Text style={styles.welcome}>Welcome User👋</Text>
        <Text style={styles.name}>AJ Gold Catalogue</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Change collection"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "ProductTypeSelection" }],
          })
        }
        style={({ pressed }) => [
          styles.changeCollectionButton,
          pressed && styles.changeCollectionButtonPressed,
        ]}
      >
        <Ionicons name="swap-horizontal-outline" size={16} color={colors.primary} />
        <Text style={styles.changeCollectionText}>Change collection</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  welcome: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "#555",
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 18,
  },
  changeCollectionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  changeCollectionButtonPressed: {
    backgroundColor: colors.cream,
  },
  changeCollectionText: {
    color: colors.primary,
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  icons: {
    flexDirection: "row",
  },
  iconBtn: {
    marginLeft: 15,
  },
});
