import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../constants/theme';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProductDetailScreen } from '../screens/shop/ProductDetailScreen';
import { ProductListingScreen } from '../screens/shop/ProductListingScreen';
import { FilterSortScreen } from '../screens/shop/FilterSortScreen';
import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name="ProductListing" component={ProductListingScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="FilterSort" component={FilterSortScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
