import { useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { fetchCategories } from "../api/categorySlice";
import { fetchFilteredDesigns } from "../api/designSlice";
import { fetchProductDesigns } from "../api/productDesignSlice";
import AppHeader from "../components/AppHeader";
import AppLoader from "../components/AppLoader";
import NoData from "../components/NoDataFound";
import useAppDispatch from "../hooks/useAppDispatch";
import useAppNavigation from "../hooks/useAppNavigation";
import { useAuthData } from "../hooks/useAuthData";
import { RootState } from "../redux/store";
import CategoryList from "../screens/HomeScreen/components/CategoryList";
import SubCategoryList from "../screens/HomeScreen/components/SubCategoryList";
import { ProductSection } from "../screens/HomeScreen/components/ProductSection";
import colors from "../theme/colors";

const CategoryProductsScreen = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const { token } = useAuthData();
  const params = (route.params as any) || {};

  const {
    category = null,
    subCategory = null,
    weightRangeStart = null,
    weightRangeEnd = null,
  } = params;

  const { categories } = useSelector((state: RootState) => state.category);

  const onEndReachedCalledDuringMomentum = useRef(true);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(category);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(subCategory);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [filteredDesigns, setFilteredDesigns] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (token && (!categories || categories.length === 0)) {
      dispatch(fetchCategories({ token }));
    }
  }, [dispatch, token, categories]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const cat = categories.find((c: any) => c.id === selectedCategory);
      if (cat && cat.subCat) {
        setSubCategories(cat.subCat);
      } else {
        setSubCategories([]);
      }
    }
  }, [selectedCategory, categories]);

  useEffect(() => {
    setPage(0);
    setFilteredDesigns([]);
    loadDesigns(0, selectedCategory, selectedSubCategory);
  }, [selectedCategory, selectedSubCategory]);

  const loadDesigns = (newPage: number, categoryId: number | null, subCategoryId: number | null) => {
    if (loading || (newPage >= totalPages && totalPages !== 0 && newPage !== 0)) {
      return;
    }

    setLoading(true);
    if (newPage === 0) {
      setInitialLoading(true);
    }
    dispatch(
      fetchFilteredDesigns({
        token: token || "",
        page: newPage,
        size: 10,
        category: categoryId || undefined,
        subCategory: subCategoryId || undefined,
        weightRangeStart,
        weightRangeEnd,
      })
    )
      .unwrap()
      .then((res) => {
        setFilteredDesigns((prev) =>
          newPage === 0 ? res.designs : [...prev, ...res.designs]
        );
        setPage(res.currentPage);
        setTotalPages(res.totalPages);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  };

  const handleLoadMore = () => {
    loadDesigns(page + 1, selectedCategory, selectedSubCategory);
  };

  const onProductClick = (design: any) => {
    dispatch(fetchProductDesigns({ productId: design.id.toString(), token: token || "" }))
      .unwrap()
      .then(() => {
        console.log("Design details loaded for product:", design.id);
        console.log("Navigating to ProductDetail with design:", design);
        navigation.navigate("ProductDetail", { design });
      });
  };

  const handleCategoryPress = (categoryItem: any) => {
    setSelectedCategory(categoryItem.id);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryPress = (subCatItem: any) => {
    setSelectedSubCategory(subCatItem ? subCatItem.id : null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppHeader title="Products" onBackPress={() => navigation.goBack()} />
      
      <View>
        <CategoryList 
          categories={categories} 
          onCategoryPress={handleCategoryPress} 
          activeCategoryId={selectedCategory} 
        />
        <SubCategoryList 
          subCategories={subCategories} 
          onSubCategoryPress={handleSubCategoryPress} 
          activeSubCategoryId={selectedSubCategory} 
        />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        {!initialLoading && (
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
        )}
      </View>

      <AppLoader visible={initialLoading} />
    </View>
  );
};

export default CategoryProductsScreen;