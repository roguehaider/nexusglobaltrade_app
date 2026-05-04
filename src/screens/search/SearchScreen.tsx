import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../../components/EmptyState';
import { GradientBackground } from '../../components/GradientBackground';
import { ProductCard } from '../../components/ProductCard';
import { products as source } from '../../constants/mockData';
import { colors, radius, spacing, typography } from '../../constants/theme';
import type { SearchStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { filterAndSort } from '../../utils/productFilters';
import type { Product } from '../../types';

type Nav = NativeStackNavigationProp<SearchStackParamList>;

export function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);
  const wishIds = useAppSelector((s) => s.wishlist.ids);
  const [query, setQuery] = useState('');

  const data = useMemo(
    () => filterAndSort(source, filters, query),
    [filters, query],
  );

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
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 52) }]}>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Search products"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
        <Pressable
          style={styles.filterBtn}
          onPress={() => navigation.navigate('FilterSort')}
        >
          <Ionicons name="options-outline" size={22} color={colors.accent} />
        </Pressable>
      </View>
      <FlatList
        data={data}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No matches"
            message="Try another keyword or relax filters."
            actionLabel="Filters"
            onAction={() => navigation.navigate('FilterSort')}
          />
        }
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={8}
        windowSize={5}
        removeClippedSubviews
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: 10,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  searchRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    paddingVertical: 12,
    fontSize: typography.body,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  list: { padding: spacing.md, paddingBottom: 100, flexGrow: 1 },
  row: { gap: 12, justifyContent: 'space-between' },
  gridItem: { flex: 1, maxWidth: '50%', paddingHorizontal: 6 },
});
