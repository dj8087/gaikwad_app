import React, { useEffect, useCallback } from "react";
import { ScrollView, Text } from "react-native";
import { useSelector } from "react-redux";
import { fetchDesignList } from "../../api/designSlice";
import { fetchProductDesigns } from "../../api/productDesignSlice";
import { fetchBanners } from "../../api/bannerSlice";
import { fetchCategories } from "../../api/categorySlice";

import AppLoader from "../../components/AppLoader";
import Carousel from "../../components/ImageCarousel";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppNavigation from "../../hooks/useAppNavigation";
import { useAuthData } from "../../hooks/useAuthData";
import { RootState } from "../../redux/store";
import colors from "../../theme/colors";
import { useAndroidBackExit } from "../../utils/useAndroidBackHandler";

import CategoryList from "./components/CategoryList";
import Header from "./components/Header";
import { ProductSection } from "./components/ProductSection";
import { getBaseUrl } from "../../utils/common";

export default function HomeScreen() {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const { token } = useAuthData();

  useAndroidBackExit();

  // -------------------- SELECTORS --------------------
  const { designs, loading: designLoading, error } = useSelector(
    (state: RootState) => state.designs
  );

  const { categories, loading: categoryLoading } = useSelector(
    (state: RootState) => state.category
  );

  const { banners, loading: bannerLoading } = useSelector(
    (state: RootState) => state.banner
  );

  // -------------------- API CALLS --------------------
  useEffect(() => {
    if (!token) return;

    dispatch(fetchDesignList({ token, size: 4, page: 0 }));
    dispatch(fetchCategories({ token }));
    dispatch(fetchBanners({ token }));
  }, [token, dispatch]);

  // -------------------- HANDLERS --------------------
  const onProductClick = useCallback(
    (design: any) => {
      dispatch(
        fetchProductDesigns({
          productId: design.id.toString(),
          token,
        })
      )
        .unwrap()
        .then(() => {
          navigation.navigate("ProductDetail", { design });
        });
    },
    [dispatch, navigation, token]
  );

  // -------------------- LOADING STATE --------------------
  const isLoading = designLoading || categoryLoading || bannerLoading;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      showsVerticalScrollIndicator={false}
    >
      <Header />

      <Carousel
        data={
          banners?.map((item, index) => ({
            id: index,
            url: getBaseUrl() + 'images/banners/' + item,
          })) || []
        }
        style={{ height: 200 }}
      />

      {!designLoading && (
        <>
          <CategoryList categories={categories} />

          {!error && (
            <ProductSection
              title="Latest Designs:"
              data={designs}
              onSeeAll={() => console.log("SEE ALL DESIGNS")}
              onProductPress={onProductClick}
            />
          )}
        </>
      )}

      {error && (
        <Text style={{ color: "red", textAlign: "center" }}>
          {error}
        </Text>
      )}

      <AppLoader visible={isLoading} />
    </ScrollView>
  );
}