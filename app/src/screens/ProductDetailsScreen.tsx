import React, { useMemo } from "react";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import AppHeader from "../components/AppHeader";
import NoData from "../components/NoDataFound";
import useAppNavigation from "../hooks/useAppNavigation";
import { RootState } from "../redux/store";
import DesignSlide from "./ProductDetail/components/DesignSlide";

export default function ProductDetailScreen({ route }: any) {
  const { design } = route.params;
  const navigation = useAppNavigation()

  const { designsByProductId } = useSelector(
    (state: RootState) => state.productDesignSelector
  );

  const designSlides = useMemo(() => {
    const data = designsByProductId?.data || [];
    return Object.keys(data).map((key) => ({
      selector: key,
      data: data[key],
    }));
  }, [designsByProductId]);

  return (
    <>
      <AppHeader title={design.name} onBackPress={() => navigation.goBack()} />
      {
        designsByProductId?.data ?
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
          /> :
          <NoData />
      }
    </>
  );
}
