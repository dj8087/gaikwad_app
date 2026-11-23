import React from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import assets from "../assets";
import { clearCategories } from "../api/categorySlice";
import { clearDesigns } from "../api/designSlice";
import { clearProductDesign } from "../api/productDesignSlice";
import { setProductType } from "../api/productTypeSlice";
import type { ProductType } from "../api/productTypeSlice";
import useAppNavigation from "../hooks/useAppNavigation";
import type { AppDispatch } from "../redux/store";
import colors from "../theme/colors";
import { fonts } from "../theme/fonts";

const productTypes: { label: string; value: ProductType; detail: string }[] = [
  {
    label: "Temple Jewellery",
    value: "TJ",
    detail: "Explore our temple jewellery collection",
  },
  {
    label: "Kolhapuri Thushi",
    value: "KT",
    detail: "Explore the Kolhapuri Thushi collection",
  },
];

export default function ProductTypeSelectionScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useAppNavigation();

  const handleSelect = (productType: ProductType) => {
    dispatch(clearCategories());
    dispatch(clearDesigns());
    dispatch(clearProductDesign());
    dispatch(setProductType(productType));
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashbaord" }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={assets.images.productTypeIcon} style={styles.logo} resizeMode="contain" />

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>WELCOME TO AJ GOLD</Text>
          <Text style={styles.title}>Choose your collection</Text>
          <Text style={styles.description}>
            Select a product type to discover our designs.
          </Text>
        </View>

        <View style={styles.options}>
          {productTypes.map(({ label, value, detail }) => (
            <Pressable
              key={value}
              accessibilityRole="button"
              onPress={() => handleSelect(value)}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
            >
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{label}</Text>
                <Text style={styles.optionDetail}>{detail}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.footer}>Choose one to continue</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingVertical: 28,
  },
  logo: {
    alignSelf: "center",
    width: 150,
    height: 110,
    marginBottom: 34,
  },
  heading: {
    alignItems: "center",
    marginBottom: 30,
  },
  eyebrow: {
    color: colors.roseGold,
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: 26,
    textAlign: "center",
  },
  description: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
  options: {
    gap: 14,
  },
  option: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: "#E8DED5",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 88,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionPressed: {
    backgroundColor: "#FDF9F5",
    borderColor: colors.roseGold,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    color: colors.primary,
    fontFamily: fonts.semi,
    fontSize: 18,
  },
  optionDetail: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 13,
    marginTop: 5,
  },
  arrow: {
    color: colors.roseGold,
    fontFamily: fonts.regular,
    fontSize: 32,
    marginLeft: 12,
    marginTop: -4,
  },
  footer: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 28,
    textAlign: "center",
  },
});
