import React, { useMemo } from "react";
import { FlatList, Image, View } from "react-native";
import { useSelector } from "react-redux";
import AppHeader from "../components/AppHeader";
import NoData from "../components/NoDataFound";
import useAppNavigation from "../hooks/useAppNavigation";
import { useAuthData } from "../hooks/useAuthData";
import { RootState } from "../redux/store";
import { getBaseUrl } from "../utils/common";
import DesignSlide from "./ProductDetail/components/DesignSlide";

export default function ProductDetailScreen({ route }: any) {
  const { design } = route.params;
  const navigation = useAppNavigation()
  const { token } = useAuthData()

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
          <>
            {/* Preload THUMB and MID images silently in the background */}
            <View style={{ width: 0, height: 0, opacity: 0, overflow: "hidden" }}>
              {designSlides.map((item) => (
                <React.Fragment key={`preload-group-${item.selector}`}>
                  <Image
                    key={`preload-thumb-${item.selector}`}
                    source={{
                      uri: getBaseUrl() + `images/imageSelectors/${item.selector}.jpg/THUMB`,
                      headers: token ? { token } : undefined,
                    }}
                  />
                  <Image
                    key={`preload-mid-${item.selector}`}
                    source={{
                      uri: getBaseUrl() + `images/imageSelectors/${item.selector}.jpg/MID`,
                      headers: token ? { token } : undefined,
                    }}
                  />
                </React.Fragment>
              ))}
            </View>
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
          </> :
          <NoData />
      }
    </>
  );
}
