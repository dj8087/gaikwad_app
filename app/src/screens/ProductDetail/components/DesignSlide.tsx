import AppImage from "@/app/src/components/AppImage";
import AppButton from "@/app/src/components/AppButton";
import { createProductInquiry, resetInquiryState } from "@/app/src/api/productInquirySlice";
import useAppDispatch from "@/app/src/hooks/useAppDispatch";
import colors from "@/app/src/theme/colors";
import { getBaseUrl } from "@/app/src/utils/common";
import { showError } from "@/app/src/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootState } from "@/app/src/redux/store";

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
  const dispatch = useAppDispatch();
  const inquiryLoading = useSelector((state: RootState) => state.productInquiry.loading);
  const [enquiryModalVisible, setEnquiryModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState("");

  const thumbUrl = getBaseUrl() + `images/imageSelectors/${selector}.jpg/THUMB`;
  const imageUrl = getBaseUrl() + `images/imageSelectors/${selector}.jpg/MID`;
  const openimageUrl =
    getBaseUrl() + `images/imageSelectors/${selector}.jpg/FULL`;

  const handleSendInquiry = async () => {
    if (inquiryLoading) {
      return;
    }
    if (!Number.isFinite(data.siteProductDesignId) || !Number.isFinite(data.id)) {
      showError("Unable to submit inquiry for this product.");
      return;
    }

    try {
      await dispatch(
        createProductInquiry({
          siteProductDesignId: data.siteProductDesignId,
          inquiryMsg: inquiryMsg.trim() || undefined,
          imageId: data.id,
        })
      ).unwrap();
      setEnquiryModalVisible(false);
      setInquiryMsg("");
      setEnquirySent(true);
      setSuccessModalVisible(true);
    } catch (error) {
      showError(typeof error === "string" ? error : "Unable to submit inquiry. Please try again.");
    }
  };

  const openInquiryModal = () => {
    dispatch(resetInquiryState());
    setEnquiryModalVisible(true);
  };

  const closeInquiryModal = () => {
    if (inquiryLoading) {
      return;
    }
    setEnquiryModalVisible(false);
    dispatch(resetInquiryState());
  };

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

      {enquirySent ? (
        <View style={styles.enquirySentContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#0A7D4F" />
          <Text style={styles.enquirySentText}>Inquiry Submitted</Text>
        </View>
      ) : (
        <AppButton
          title="Submit Inquiry"
          onPress={openInquiryModal}
          style={styles.enquiryBtn}
          textStyle={styles.enquiryText}
        />
      )}

      <Modal
        animationType="slide"
        transparent
        visible={enquiryModalVisible}
        onRequestClose={closeInquiryModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Send an Inquiry</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInquiryMsg}
              value={inquiryMsg}
              placeholder="Optional: Add a message for the seller..."
              multiline
              placeholderTextColor="#999"
              editable={!inquiryLoading}
              maxLength={500}
            />
            <AppButton
              title={inquiryLoading ? "Submitting..." : "Submit Inquiry"}
              onPress={handleSendInquiry}
              disabled={inquiryLoading}
              style={styles.modalButton}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeInquiryModal}
              disabled={inquiryLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              You will get a call from the AJ Gold sales office.
            </Text>
            <AppButton
              title="OK"
              onPress={() => setSuccessModalVisible(false)}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 5,
    width: "90%",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  input: {
    height: 100,
    borderColor: "#DDD",
    borderWidth: 1,
    marginBottom: 4,
    padding: 10,
    width: "100%",
    borderRadius: 10,
    textAlignVertical: "top",
    backgroundColor: "#F9F9F9",
    color: colors.text,
  },
  modalButton: {
    borderRadius: 10,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
  },
  enquirySentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#E6F2ED",
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#0A7D4F",
  },
  enquirySentText: {
    fontSize: 16,
    color: "#0A7D4F",
    marginLeft: 10,
    fontWeight: "600",
  },
});
