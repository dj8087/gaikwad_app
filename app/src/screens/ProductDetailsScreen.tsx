import React, { useEffect, useMemo, useRef } from "react";
import { Alert, FlatList, Image, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import AppHeader from "../components/AppHeader";
import AppLoader from "../components/AppLoader";
import NoData from "../components/NoDataFound";
import useAppNavigation from "../hooks/useAppNavigation";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { RootState } from "../redux/store";
import { getBaseUrl } from "../utils/common";
import DesignSlide from "./ProductDetail/components/DesignSlide";

type ProductDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ProductDetail"
>;

export default function ProductDetailScreen({
  route,
}: ProductDetailScreenProps) {
  const { design, notificationMessage } = route.params;
  const navigation = useAppNavigation()
  const shownNotificationMessage = useRef(false);
  const { designsByProductId, loading, error } = useSelector(
    (state: RootState) => state.productDesignSelector
  );

  useEffect(() => {
    if (!notificationMessage || shownNotificationMessage.current) {
      return;
    }

    shownNotificationMessage.current = true;
    navigation.setParams({ notificationMessage: undefined });
    Alert.alert(
      "Product update",
      notificationMessage,
      [{ text: "OK" }],
      { cancelable: false }
    );
  }, [navigation, notificationMessage]);

  const designSlides = useMemo(() => {
    const data = designsByProductId?.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return [];
    }

    return Object.entries(data).map(([key, value]) => ({
      selector: key,
      data: value,
    }));
  }, [designsByProductId]);

  React.useEffect(() => {
    if (designSlides && designSlides.length > 0) {
      designSlides.forEach((item) => {
        const thumbUrl = getBaseUrl() + `images/imageSelectors/${item.selector}.jpg/THUMB`;
        const midUrl = getBaseUrl() + `images/imageSelectors/${item.selector}.jpg/MID`;
        Image.prefetch(thumbUrl).catch(() => {});
        Image.prefetch(midUrl).catch(() => {});
      });
    }
  }, [designSlides]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader title={design.name} onBackPress={() => navigation.goBack()} />
      {error ? <NoData /> : designSlides.length > 0 ? (
        <FlatList
          data={designSlides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.selector}
          renderItem={({ item }) => (
            <DesignSlide
              productName={design.name}
              selector={item.selector}
              data={item.data}
            />
          )}
        />
      ) : !loading ? <NoData /> : null}
      <AppLoader visible={loading} />
    </View>
  );
}
