import { RootState } from "@/app/src/redux/store";
import { fonts } from "@/app/src/theme/fonts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function Header() {
  const { data } = useSelector((state: RootState) => state.profile);
  const user = data?.data;
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.welcome}>Welcome 👋</Text>
        <Text style={styles.name}>{user.name}</Text>
      </View>

      {/* <View style={styles.icons}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="search-outline" size={22} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={22} />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  icons: {
    flexDirection: "row",
  },
  iconBtn: {
    marginLeft: 15,
  },
});
