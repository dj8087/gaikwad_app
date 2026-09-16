import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import SplashScreen from '../screens/SplashScreen';
import Dashbaord from './TabsNavigator';
import FilteredProductsScreen from '../screens/FilteredProductsScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import FilterScreen from '../screens/FilterScreen';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  SplashScreen: undefined;
  Dashbaord: undefined;
  ProductDetail: {};
  FilteredProducts: {};
  CategoryProductsScreen: {};
  ProductFilter: {};
};


export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Dashbaord" component={Dashbaord} />
      <Stack.Screen name="ProductDetail" component={ProductDetailsScreen} />
      <Stack.Screen name="FilteredProducts" component={FilteredProductsScreen} />
      <Stack.Screen name="CategoryProductsScreen" component={CategoryProductsScreen} />
      <Stack.Screen name="ProductFilter" component={FilterScreen} />
    </Stack.Navigator>
  );
}
