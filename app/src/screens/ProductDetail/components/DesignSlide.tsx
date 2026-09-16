import AppImage from "@/app/src/components/AppImage";
import colors from "@/app/src/theme/colors";
import { getBaseUrl } from "@/app/src/utils/common";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface DesignData {
  siteProductDesignId: any;
  stock: boolean;
  weight: number;
  carat: number;
  wax: boolean;
  id: number;
}

interface Props {
  selector: string; // e.g. "1.1"
  data: DesignData;
  productName: string;
}

export default function DesignSlide({
  selector,
  data,
  productName,
}: Props) {
  const insets = useSafeAreaInsets();

  const thumbUrl = getBaseUrl() + `images/imageSelectors/${selector}.jpg/THUMB`;
  const imageUrl = getBaseUrl() + `images/imageSelectors/${selector}.jpg/MID`;
  const openimageUrl =
    getBaseUrl() + `images/imageSelectors/${selector}.jpg/FULL`;

  return (
    <ScrollView 
      style={styles.slide}
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          <AppImage
            uri={imageUrl}
            thumbUri={thumbUrl}
            openImageUri={openimageUrl}
            isOpenImage={true}
            height={height * 0.5}
          />

          <View
            style={[
              styles.stockBadge,
              { backgroundColor: data.stock ? "#0A7D4F" : "#8B0000" },
            ]}
          >
            <Text style={styles.stockText}>
              {data.stock ? "IN STOCK" : "OUT OF STOCK"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* DETAILS */}
      <View style={styles.detailsCard}>
        <Text style={styles.selector}>{productName}</Text>
        <Text style={styles.subtitle}>{selector}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Weight</Text>
          <Text style={styles.value}>{data.weight} g</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Purity</Text>
          <Text style={styles.value}>{data.carat} KT</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Wax</Text>
          <Text style={styles.value}>{data.wax ? "Yes" : "No"}</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    backgroundColor: colors.primary,
  },
  imageContainer: {
    width: "100%",
    height: height * 0.5,
  },
  stockBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stockText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  detailsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 4,
  },
  selector: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    color: colors.text,
  },
  value: {
    fontWeight: "500",
  },
});
