import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Button } from '../../components/Button';
import { GradientBackground } from '../../components/GradientBackground';
import { Header } from '../../components/Header';
import { categories, priceBounds } from '../../constants/mockData';
import { colors, spacing, typography } from '../../constants/theme';
import type { HomeStackParamList, SearchStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetFilters, setFilters } from '../../store/slices/filtersSlice';
import type { SortOption } from '../../types';

type Nav = NativeStackNavigationProp<HomeStackParamList & SearchStackParamList>;

const SORTS: { key: SortOption; label: string }[] = [
  { key: 'popularity', label: 'Popularity' },
  { key: 'price_asc', label: 'Price · Low to high' },
  { key: 'price_desc', label: 'Price · High to low' },
];

export function FilterSortScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);

  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [minRating, setMinRating] = useState(filters.minRating);
  const [categoryId, setCategoryId] = useState<string | null>(filters.categoryId);
  const [sortBy, setSort] = useState<SortOption>(filters.sortBy);

  const ratingMarks = useMemo(() => [0, 3, 4, 4.5], []);

  const apply = () => {
    const lo = Math.min(minPrice, maxPrice);
    const hi = Math.max(minPrice, maxPrice);
    dispatch(
      setFilters({
        minPrice: lo,
        maxPrice: hi,
        minRating,
        categoryId,
        sortBy,
      }),
    );
    navigation.goBack();
  };

  const clear = () => {
    dispatch(resetFilters());
    navigation.goBack();
  };

  return (
    <GradientBackground>
      <Header title="Filter & sort" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.chips}>
          <Chip active={categoryId === null} label="All" onPress={() => setCategoryId(null)} />
          {categories.map((c) => (
            <Chip
              key={c.id}
              active={categoryId === c.id}
              label={c.name}
              onPress={() => setCategoryId(c.id)}
            />
          ))}
        </View>

        <Text style={styles.label}>Price range</Text>
        <Text style={styles.rangeText}>
          ${minPrice.toFixed(0)} — ${maxPrice.toFixed(0)}
        </Text>
        <Text style={styles.hint}>Min</Text>
        <Slider
          minimumValue={priceBounds.min}
          maximumValue={priceBounds.max}
          value={minPrice}
          onValueChange={setMinPrice}
          minimumTrackTintColor={colors.accent}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.accent}
        />
        <Text style={styles.hint}>Max</Text>
        <Slider
          minimumValue={priceBounds.min}
          maximumValue={priceBounds.max}
          value={maxPrice}
          onValueChange={setMaxPrice}
          minimumTrackTintColor={colors.accent}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.accent}
        />

        <Text style={styles.label}>Minimum rating</Text>
        <View style={styles.chips}>
          {ratingMarks.map((r) => (
            <Chip
              key={String(r)}
              active={minRating === r}
              label={r === 0 ? 'Any' : `${r}+`}
              onPress={() => setMinRating(r)}
            />
          ))}
        </View>

        <Text style={styles.label}>Sort by</Text>
        {SORTS.map((s) => (
          <Pressable
            key={s.key}
            style={[styles.sortRow, sortBy === s.key && styles.sortRowActive]}
            onPress={() => setSort(s.key)}
          >
            <Text style={[styles.sortText, sortBy === s.key && styles.sortTextActive]}>{s.label}</Text>
          </Pressable>
        ))}

        <Button title="Apply" onPress={apply} />
        <Button title="Reset all" onPress={clear} variant="outline" style={{ marginTop: 12 }} />
      </ScrollView>
    </GradientBackground>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: 48 },
  label: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    fontSize: typography.body,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accentMuted },
  chipText: { color: colors.textSecondary, fontSize: typography.small },
  chipTextActive: { color: colors.accent, fontWeight: '700' },
  rangeText: { color: colors.textSecondary, marginBottom: 8 },
  hint: { color: colors.textSecondary, fontSize: typography.caption, marginTop: 8 },
  sortRow: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  sortRowActive: { borderColor: colors.accent, backgroundColor: colors.accentMuted },
  sortText: { color: colors.textSecondary, fontSize: typography.body },
  sortTextActive: { color: colors.textPrimary, fontWeight: '700' },
});
