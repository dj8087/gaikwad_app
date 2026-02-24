import { createProductInquiry } from "@/app/src/api/productInquirySlice";
import AppButton from "@/app/src/components/AppButton";
import AppImage from "@/app/src/components/AppImage";
import AppLoader from "@/app/src/components/AppLoader";
import useAppDispatch from "@/app/src/hooks/useAppDispatch";
import { useAuthData } from "@/app/src/hooks/useAuthData";
import { useImageSelector } from "@/app/src/hooks/useImageSelector";
import colors from "@/app/src/theme/colors";
import { getBaseUrl } from "@/app/src/utils/common";
import { showError } from "@/app/src/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
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
  const { token } = useAuthData();
  const dispatch = useAppDispatch();

  const [enquiryModalVisible, setEnquiryModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState("");

  const imageUrl = getBaseUrl() + `images/imageSelectors/${selector}.jpg/MID`;
  const openimageUrl =
    getBaseUrl() + `images/imageSelectors/${selector}.jpg/FULL`;

  const handleSendEnquiry = () => {
    dispatch(
      createProductInquiry({
        siteVisitorId: data?.id,
        siteProductDesignId: data?.siteProductDesignId,
        productCode: data?.sampleBarcode ?? "null",
        token: token,
        inquiryMsg: inquiryMsg,
      })
    )
      .unwrap()
      .then((res) => {
        if (res.code != 200) {
          showError(res.message);
        } else {
          setEnquiryModalVisible(false);
          setInquiryMsg("");
          setEnquirySent(true);
          setSuccessModalVisible(true);
        }
      });
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

      {/* --- Modals --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={enquiryModalVisible}
        onRequestClose={() => setEnquiryModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Send an Enquiry</Text>
            <TextInput
              style={styles.input}
              onChangeText={setInquiryMsg}
              value={inquiryMsg}
              placeholder="Optional: Add a message for the seller..."
              multiline
              placeholderTextColor="#999"
            />
            <AppButton
              title="Send Enquiry"
              onPress={handleSendEnquiry}
              style={styles.modalButton}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEnquiryModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              You will get call from AJ Gold Sale Office
            </Text>
            <AppButton
              title="OK"
              onPress={() => setSuccessModalVisible(false)}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
      {/* --- End Modals --- */}

      {enquirySent ? (
        <View style={styles.enquirySentContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#0A7D4F" />
          <Text style={styles.enquirySentText}>Enquiry Sent</Text>
        </View>
      ) : (
        <AppButton
          title="Enquiry"
          onPress={() => setEnquiryModalVisible(true)}
          style={styles.enquiryBtn}
          textStyle={styles.enquiryText}
        />
      )}

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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: "100%",
    borderRadius: 10,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
  modalButton: {
    borderRadius: 10,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "transparent",
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
    fontSize: 18,
    color: "#0A7D4F",
    marginLeft: 10,
    fontWeight: "600",
  },
});
