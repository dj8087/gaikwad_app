import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface Props {
  uri: string;
  token?: string;
}

export default function PinchPanZoomImage({ uri, token }: Props) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  /* ---------- PINCH ---------- */
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      let nextScale = savedScale.value * e.scale;
      nextScale = Math.max(1, Math.min(nextScale, 4));
      scale.value = nextScale;
    })
    .onEnd(() => {
      // 🔥 ZOOM OUT → RESET
      if (scale.value <= 1) {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);

        savedScale.value = 1;
        savedX.value = 0;
        savedY.value = 0;
      } else {
        savedScale.value = scale.value;
      }
    });

  /* ---------- PAN ---------- */
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value > 1) {
        translateX.value = savedX.value + e.translationX;
        translateY.value = savedY.value + e.translationY;
      }
    })
    .onEnd(() => {
      savedX.value = translateX.value;
      savedY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.Image
        source={{ uri, headers: token ? { token } : undefined }}
        resizeMode="contain"
        style={[styles.image, animatedStyle]}
      />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  image: {
    width,
    height,
    backgroundColor: "black",
  },
});
