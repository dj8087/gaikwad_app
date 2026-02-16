import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useRoute } from "@react-navigation/native";
import ScreenWrapper from "../components/ScreenWrapper";
import AppHeader from "../components/AppHeader";
import { ProductSection } from "../screens/HomeScreen/components/ProductSection";
import useAppDispatch from '../hooks/useAppDispatch';
import { fetchDesignList } from "../api/designSlice";
import { useAuthData } from "../hooks/useAuthData";
import NoData from "../components/NoDataFound";
import AppLoader from "../components/AppLoader";
import useAppNavigation from '../hooks/useAppNavigation';
import { fetchProductDesigns } from "../api/productDesignSlice";

const FilteredProductsScreen = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const { token } = useAuthData();
  const { category, subCategory, weightRangeStart, weightRangeEnd } =
    route.params as any;

  const [page, setPage] = useState(0);
  const [designs, setDesigns] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadDesigns(0);
  }, [category, subCategory, weightRangeStart, weightRangeEnd]);

  const loadDesigns = (newPage: number) => {
    if (loading || (newPage >= totalPages && totalPages !== 0)) {
      return;
    }

    setLoading(true);
    if (newPage === 0) {
      setInitialLoading(true);
    }
    dispatch(
      fetchDesignList({
        token,
        page: newPage,
        size: 10,
        category,
        subCategory,
        weightRangeStart,
        weightRangeEnd,
      })
    )
      .unwrap()
      .then((res) => {
        setDesigns(newPage === 0 ? res.designs : [...designs, ...res.designs]);
        setPage(res.currentPage);
        setTotalPages(res.totalPages);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  };

  const handleLoadMore = () => {
    loadDesigns(page + 1);
  };

  const onProductClick = (design: any) => {
    dispatch(fetchProductDesigns({ productId: design.id.toString(), token })).unwrap().then(() => {
      navigation.navigate("ProductDetail", { design })
    })
  }

  if (initialLoading) {
    return <AppLoader visible={true} />;
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Filtered Products" />
      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <ProductSection
          data={designs}
          onEndReached={handleLoadMore}
          loading={loading}
          ListEmptyComponent={!loading ? <NoData /> : null}
          onProductPress={onProductClick}
        />
      </View>
    </ScreenWrapper>
  );
};

export default FilteredProductsScreen;
