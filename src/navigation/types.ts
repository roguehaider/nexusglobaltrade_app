import type { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ProductListing: { categoryId: string | null; title: string };
  ProductDetail: { productId: string };
  FilterSort: undefined;
};

export type SearchStackParamList = {
  SearchMain: undefined;
  ProductDetail: { productId: string };
  FilterSort: undefined;
  ProductListing: { categoryId: string | null; title: string };
};

export type CartStackParamList = {
  CartMain: undefined;
  Checkout: { subtotal: number; shipping: number; total: number };
  Payment: {
    subtotal: number;
    shipping: number;
    total: number;
    address: import('../types').Address;
  };
  OrderSuccess: { orderId: string };
};

export type OrdersStackParamList = {
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  CartTab: NavigatorScreenParams<CartStackParamList>;
  OrdersTab: NavigatorScreenParams<OrdersStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type HomeNav = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  BottomTabNavigationProp<MainTabParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
