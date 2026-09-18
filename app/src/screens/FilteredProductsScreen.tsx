import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useRoute } from "@react-navigation/native";
import AppHeader from "../components/AppHeader";
import { ProductSection } from "../screens/HomeScreen/components/ProductSection";
import useAppDispatch from '../hooks/useAppDispatch';
import { fetchFilteredDesigns } from "../api/designSlice";
import NoData from "../components/NoDataFound";
import AppLoader from "../components/AppLoader";
import useAppNavigation from '../hooks/useAppNavigation';
import { fetchProductDesigns } from "../api/productDesignSlice";
import { showError } from "../utils/toast";

const FilteredProductsScreen = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const params = route.params as any || {};

  const {
    category = null,
    subCategory = null,
    weightRangeStart = null,
    weightRangeEnd = null,
    searchQuery = null,
  } = params;

  const onEndReachedCalledDuringMomentum = useRef(true);

  const [page, setPage] = useState(0);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    setPage(0);
    setFilteredDesigns([]);
    loadDesigns(0);
  }, []);


  const loadDesigns = (newPage: number) => {
    if (loading || (newPage >= totalPages && totalPages !== 0)) {
      return;
    }

    setLoading(true);
    if (newPage === 0) {
      setInitialLoading(true);
    }
    dispatch(
      fetchFilteredDesigns({
        page: newPage,
        size: 10,
        category,
        subCategory,
        weightRangeStart,
        weightRangeEnd,
        searchQuery: searchQuery || undefined,
      })
    )
      .unwrap()
      .then((res) => {
        setFilteredDesigns(prev => newPage === 0 ? res.designs : [...prev, ...res.designs]);
        setPage(res.currentPage);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        showError("Unable to load products. Please try again.");
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
    dispatch(fetchProductDesigns({ productId: design.id.toString() })).unwrap().then(() => {
      navigation.navigate("ProductDetail", { design })
    }).catch(() => {
      showError("Unable to load product details. Please try again.");
    });
  }

  if (initialLoading) {
    return <AppLoader visible={true} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader title="Filtered Products" onBackPress={() => navigation.goBack()} />
      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <ProductSection
          data={filteredDesigns}
          loading={loading}
          ListEmptyComponent={<NoData />}
          onProductPress={onProductClick}
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum.current) {
              handleLoadMore();
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
        />
      </View>
    </View>
  );
};

export default FilteredProductsScreen;
