import { createProductInquiry } from "@/app/src/api/productInquirySlice";
import AppButton from "@/app/src/components/AppButton";
import AppImage from "@/app/src/components/AppImage";
import AppLoader from "@/app/src/components/AppLoader";
import useAppDispatch from "@/app/src/hooks/useAppDispatch";
import useAppNavigation from "@/app/src/hooks/useAppNavigation";
import { useAuthData } from "@/app/src/hooks/useAuthData";
import { useImageSelector } from "@/app/src/hooks/useImageSelector";
import colors from "@/app/src/theme/colors";
import { getBaseUrl } from "@/app/src/utils/common";
import { showError, showSuccess } from "@/app/src/utils/toast";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface DesignData {
  id: any;
  siteProductDesignId: any;
  stock: boolean;
  sampleBarcode: any;
  weight: number;
  carat: number;
  wax: boolean;
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
  const { loading } = useImageSelector(selector);
  const { token } = useAuthData()
  const navigation = useAppNavigation()
  const dispatch = useAppDispatch()

  const imageUrl = getBaseUrl() + `images/imageSelectors/${selector}.jpg/MID`;
  const openimageUrl = getBaseUrl() + `images/imageSelectors/${selector}.jpg/FULL`;

  const handleEnquiry = () => {
    dispatch(
      createProductInquiry({
        siteVisitorId: data?.id,
        siteProductDesignId: data?.siteProductDesignId,
        productCode: data?.sampleBarcode ?? "null",
        token: token,
      })
    ).unwrap().then((res) => {
      if (res.code != 200) {
        showError(res.message)
      } else {
        showSuccess(res.message)
        navigation.goBack()
      }
    })
  };

  return (
    <View style={styles.slide}>
      <TouchableOpacity activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          <AppImage
            uri={imageUrl}
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
        <Text style={styles.selector}>
          {productName} {selector}
        </Text>

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

      <AppButton
        title="Enquiry"
        onPress={handleEnquiry}
        style={styles.enquiryBtn}
        textStyle={styles.enquiryText}
      />

      <AppLoader visible={loading} />
    </View>
  );
}


const styles = StyleSheet.create({
  slide: {
    width,
    backgroundColor: colors.primary,
    paddingBottom: 20,
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
    marginBottom: 12,
    color: colors.text,
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
  enquiryBtn: {
    marginHorizontal: 16,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  enquiryText: {
    fontSize: 18,
    color: colors.primary,
  },
});
