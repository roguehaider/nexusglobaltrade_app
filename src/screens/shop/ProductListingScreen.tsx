import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../../components/EmptyState';
import { GradientBackground } from '../../components/GradientBackground';
import { Header } from '../../components/Header';
import { ProductCard } from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/Skeleton';
import { products as source } from '../../constants/mockData';
import { colors, spacing, typography } from '../../constants/theme';
import type { HomeStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setFilters } from '../../store/slices/filtersSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { filterAndSort } from '../../utils/productFilters';
import type { Product } from '../../types';

type Nav = NativeStackNavigationProp<HomeStackParamList>;
type R = RouteProp<HomeStackParamList, 'ProductListing'>;

export function ProductListingScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);
  const wishIds = useAppSelector((s) => s.wishlist.ids);
  const [refreshing, setRefreshing] = useState(false);
  const [boot, setBoot] = useState(true);

  useEffect(() => {
    dispatch(
      setFilters({
        categoryId: route.params.categoryId,
      }),
    );
  }, [dispatch, route.params.categoryId]);

  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 400);
    return () => clearTimeout(t);
  }, []);

  const data = useMemo(
    () => filterAndSort(source, filters, undefined),
    [filters],
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.gridItem}>
      <ProductCard
        product={item}
        wishlisted={wishIds.includes(item.id)}
        onToggleWishlist={() => dispatch(toggleWishlist(item.id))}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      />
    </View>
  );

  return (
    <GradientBackground>
      <Header
        title={route.params.title}
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            onPress={() => navigation.navigate('FilterSort')}
            hitSlop={10}
            style={styles.iconBtn}
          >
            <Ionicons name="options-outline" size={22} color={colors.accent} />
          </Pressable>
        }
      />
      {boot ? (
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(x) => String(x)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={() => (
            <View style={styles.gridItem}>
              <ProductCardSkeleton />
            </View>
          )}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No products match"
              message="Adjust filters or pick another category."
              actionLabel="Edit filters"
              onAction={() => navigation.navigate('FilterSort')}
            />
          }
          renderItem={renderItem}
          initialNumToRender={8}
          windowSize={5}
          removeClippedSubviews
        />
      )}
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, paddingBottom: 80 },
  row: { gap: 12, justifyContent: 'space-between' },
  gridItem: { flex: 1, maxWidth: '50%', paddingHorizontal: 6 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
