import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryCard } from '../../components/CategoryCard';
import { GradientBackground } from '../../components/GradientBackground';
import { ProductCard } from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/Skeleton';
import { categories, products } from '../../constants/mockData';
import { colors, spacing, typography } from '../../constants/theme';
import type { HomeStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setFilters } from '../../store/slices/filtersSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
type Nav = NativeStackNavigationProp<HomeStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const wishIds = useAppSelector((s) => s.wishlist.ids);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const featured = useMemo(
    () => [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 6),
    [],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const openCategory = (id: string | null, title: string) => {
    dispatch(setFilters({ categoryId: id }));
    navigation.navigate('ProductListing', { categoryId: id, title });
  };

  return (
    <GradientBackground>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.secondaryAccent, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.hello}>Nexus Global Trade</Text>
          <Text style={styles.headline}>Baby essentials. Trusted brands.</Text>
          <Pressable
            style={styles.searchBar}
            onPress={() =>
              navigation.getParent()?.navigate('SearchTab', { screen: 'SearchMain' })
            }
          >
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <Text style={styles.searchPh}>Search formula, food, nappies, brands…</Text>
          </Pressable>
        </LinearGradient>

        <Text style={styles.section}>Categories</Text>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(c) => c.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={() => openCategory(item.id, item.name)}
            />
          )}
        />

        <View style={styles.sectionRow}>
          <Text style={styles.section}>Trending</Text>
          <Pressable onPress={() => openCategory(null, 'All products')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.grid}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.gridItem}>
                <ProductCardSkeleton />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.grid}>
            {featured.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <ProductCard
                  product={item}
                  wishlisted={wishIds.includes(item.id)}
                  onToggleWishlist={() => dispatch(toggleWishlist(item.id))}
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xxl, paddingHorizontal: spacing.md },
  hero: {
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hello: { color: colors.textSecondary, fontSize: typography.small, letterSpacing: 2 },
  headline: {
    color: colors.textPrimary,
    fontSize: typography.h1,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(13,13,13,0.55)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPh: { color: colors.textSecondary, fontSize: typography.small },
  section: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  seeAll: { color: colors.accent, fontWeight: '700', fontSize: typography.small },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  gridItem: { width: '48%' },
});
