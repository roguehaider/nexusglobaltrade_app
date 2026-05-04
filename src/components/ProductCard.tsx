import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, radius, shadows, typography } from '../constants/theme';
import { formatCurrency } from '../utils/format';
import type { Product } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  product: Product;
  onPress: () => void;
  onToggleWishlist?: () => void;
  wishlisted?: boolean;
  style?: object;
};

export function ProductCard({ product, onPress, onToggleWishlist, wishlisted, style }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[styles.card, shadows.card, animatedStyle, style]}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          contentFit="cover"
          transition={{ duration: 200 }}
        />
        {onToggleWishlist ? (
          <Pressable
            style={styles.heart}
            onPress={() => onToggleWishlist()}
            hitSlop={8}
          >
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={22}
              color={wishlisted ? colors.accent : colors.textPrimary}
            />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.brand} numberOfLines={1}>
          {product.brand ?? 'Nexus'}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          {product.originalPrice ? (
            <Text style={styles.was}>{formatCurrency(product.originalPrice)}</Text>
          ) : null}
        </View>
        <View style={styles.meta}>
          <Ionicons name="star" size={14} color={colors.accent} />
          <Text style={styles.rating}>
            {product.rating.toFixed(1)} ({product.reviewCount})
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 14,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', aspectRatio: 1 },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(13,13,13,0.55)',
    padding: 8,
    borderRadius: radius.full,
  },
  body: { padding: 12 },
  brand: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600',
    marginBottom: 2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: '600',
    minHeight: 36,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  price: { color: colors.accent, fontSize: typography.body, fontWeight: '800' },
  was: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    textDecorationLine: 'line-through',
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  rating: { color: colors.textSecondary, fontSize: typography.caption },
});
