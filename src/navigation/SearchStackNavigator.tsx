import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../constants/theme';
import { SearchScreen } from '../screens/search/SearchScreen';
import { ProductDetailScreen } from '../screens/shop/ProductDetailScreen';
import { ProductListingScreen } from '../screens/shop/ProductListingScreen';
import { FilterSortScreen } from '../screens/shop/FilterSortScreen';
import type { SearchStackParamList } from './types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export function SearchStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SearchMain"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="SearchMain" component={SearchScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="ProductListing" component={ProductListingScreen} />
      <Stack.Screen name="FilterSort" component={FilterSortScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
