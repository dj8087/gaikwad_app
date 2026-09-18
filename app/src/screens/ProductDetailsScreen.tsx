import React, { useMemo } from "react";
import { FlatList, Image, View } from "react-native";
import { useSelector } from "react-redux";
import AppHeader from "../components/AppHeader";
import AppLoader from "../components/AppLoader";
import NoData from "../components/NoDataFound";
import useAppNavigation from "../hooks/useAppNavigation";
import { RootState } from "../redux/store";
import { getBaseUrl } from "../utils/common";
import DesignSlide from "./ProductDetail/components/DesignSlide";

export default function ProductDetailScreen({ route }: any) {
  const { design } = route.params;
  const navigation = useAppNavigation()
  const { designsByProductId, loading, error } = useSelector(
    (state: RootState) => state.productDesignSelector
  );

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
