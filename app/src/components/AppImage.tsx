import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import assets from "../assets";
import { useAuthData } from "../hooks/useAuthData";
import colors from '../theme/colors';
import PinchPanZoomImage from "./ZoomableImage";

interface AppImageProps {
  uri?: string;
  openImageUri?: string;
  inStock?: boolean;
  height?: number;
  containerStyle?: any;
  fallbackImage?: any;
  isOpenImage?: boolean;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function AppImage({
  uri,
  openImageUri,
  inStock,
  height = SCREEN_HEIGHT * 0.5,
  containerStyle,
  fallbackImage = assets.images.ring,
  isOpenImage = false,
}: AppImageProps) {
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const [open, setOpen] = useState(false);
  const { token } = useAuthData()

  const scale = React.useRef(new Animated.Value(0)).current

  const handlePinch = Animated.event([{ nativeEvent: { scale } }])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [loading]);

  if (!uri || showFallback) {
    return (
      <View style={[styles.container, { height }, containerStyle]}>
        <Image
          source={fallbackImage}
          style={styles.fallbackImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <>
      {/* -------- Main Image -------- */}
      <View style={[styles.container, { height }, containerStyle]}>
        <TouchableOpacity
          activeOpacity={isOpenImage ? 0.9 : 1}
          disabled={!isOpenImage}
          style={{ width: "100%", height: "100%" }}
          onPress={() => setOpen(true)}
        >
          <Image
            source={{
              uri,
              headers: { token },
            }}
            style={styles.image}
            resizeMode="cover"
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setShowFallback(true);
              setLoading(false);
            }}
          />
        </TouchableOpacity>


        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#C9A24D" />
          </View>
        )}

        {typeof inStock === "boolean" && (
          <View
            style={[
              styles.stockBadge,
              { backgroundColor: inStock ? "#1E7F45" : "#8B1E1E" },
            ]}
          >
            <Text style={styles.stockText}>
              {inStock ? "In Stock" : "Out of Stock"}
            </Text>
          </View>
        )}
      </View>

      <Modal visible={open} transparent animated animationType="fade">
        <View style={styles.modalContainer}>
          <GestureHandlerRootView style={styles.modalRoot}>
            <PinchPanZoomImage uri={openImageUri} token={token} />
          </GestureHandlerRootView>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setOpen(false)}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FAF7F2",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  stockBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 4,
  },
  stockText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  fallbackImage: {
    width: 120,
    height: 120,
    opacity: 0.9,
  },

  /* Modal */
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 20,
    fontWeight: "600",
  },
   modalRoot: {
    flex: 1,
    backgroundColor: "black",
  },
});
