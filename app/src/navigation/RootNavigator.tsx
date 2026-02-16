import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AccessTokenScreen from '../screens/AccessTokenScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import SplashScreen from '../screens/SplashScreen';
import SplashScreen1 from '../screens/SplashScreen1';
import Dashbaord from './TabsNavigator';
import FilteredProductsScreen from '../screens/FilteredProductsScreen';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  SplashScreen: undefined;
  Splash1: undefined;
  AccessTokenScreen: undefined;
  RegistrationScreen: undefined;
  Dashbaord: undefined;
  ProductDetail: {};
  FilteredProducts: {};
};


export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash1" component={SplashScreen1} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Dashbaord" component={Dashbaord} />
      <Stack.Screen name="AccessTokenScreen" component={AccessTokenScreen} />
      <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailsScreen} />
      <Stack.Screen name="FilteredProducts" component={FilteredProductsScreen} />
    </Stack.Navigator>
  );
}
