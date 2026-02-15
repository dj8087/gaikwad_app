import React from "react";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    View,
} from "react-native";
import assets from "../assets";

interface AppLoaderProps {
  visible?: boolean;
  text?: string;
}

export default function AppLoader({
  visible = true,
  text,
}: AppLoaderProps) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image
            source={assets.images.logoGif}
            style={styles.logo}
            resizeMode="contain"
          />
          {text ? <Text style={styles.text}>{text}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 28,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  logo: {
    width: 90,
    height: 90,
  },
  text: {
    marginTop: 14,
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});

