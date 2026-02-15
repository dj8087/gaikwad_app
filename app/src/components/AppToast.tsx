import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

type ToastType = "success" | "error" | "warning";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
}

const AppToast = ({ visible, message, type = "success" }: ToastProps) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const backgroundColors = {
    success: "#4BB543",
    error: "#D9534F",
    warning: "#F0AD4E",
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2500);
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: backgroundColors[type] },
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 10,
    zIndex: 999,
    elevation: 5,
  },
  message: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default AppToast;
