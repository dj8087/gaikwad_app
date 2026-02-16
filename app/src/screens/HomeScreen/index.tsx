import React, { useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { fetchDesignList } from '../../api/designSlice';
import { fetchProductDesigns } from '../../api/productDesignSlice';
import AppLoader from '../../components/AppLoader';
import Carousel from '../../components/ImageCarousel';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppNavigation from '../../hooks/useAppNavigation';
import { useAuthData } from '../../hooks/useAuthData';
import { RootState } from '../../redux/store';
import colors from '../../theme/colors';
import { useAndroidBackExit } from '../../utils/useAndroidBackHandler';
import CategoryList from './components/CategoryList';
import Header from './components/Header';
import { ProductSection } from './components/ProductSection';

export default function HomeScreen() {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const { token } = useAuthData();
  useAndroidBackExit()
  
  const { designs, loading, error } = useSelector(
    (state: RootState) => state.designs
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchDesignList({ token, size: 4, page: 0 }));
    }
  }, [token]);


  const onProductClick = (design: any) => {
    dispatch(fetchProductDesigns({ productId: design.id.toString(), token })).unwrap().then(() => {
      navigation.navigate("ProductDetail", { design })
    })
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      showsVerticalScrollIndicator={false}
    >
      <Header />

      <Carousel data={[
        { id: 1, url: "https://marketplace.canva.com/EAG20zmI0Aw/1/0/1600w/canva-brown-and-beige-modern-new-product-sale-banner-landscape--U8HqZtV1w8.jpg" },
        { id: 2, url: "https://i.pinimg.com/originals/28/ab/11/28ab11b28c7565c6c8e61e6b1d2e3d49.jpg" },
        { id: 3, url: "https://i.pinimg.com/originals/a0/98/0d/a0980dad0e1c42cb68d556bf6d0f6700.jpg" }
      ]} style={{ height: 200 }} />

      {
        !loading &&
        <>
          <CategoryList />
          {!loading && !error && (
            <ProductSection
              title="Latest Designs:"
              data={designs}
              onSeeAll={() => console.log("SEE ALL DESIGNS")}
              onProductPress={onProductClick}
            />
          )}
        </>
      }

      {error && <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>}
      <AppLoader visible={loading} />
    </ScrollView>
  );
}
