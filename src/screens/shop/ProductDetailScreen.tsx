import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { Button } from '../../components/Button';
import { GradientBackground } from '../../components/GradientBackground';
import { Header } from '../../components/Header';
import { colors, radius, spacing, typography } from '../../constants/theme';
import type { HomeStackParamList, SearchStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { formatCurrency } from '../../utils/format';
import { getProductById } from '../../utils/productFilters';

type Nav = NativeStackNavigationProp<HomeStackParamList & SearchStackParamList>;
type R = RouteProp<HomeStackParamList, 'ProductDetail'> | RouteProp<SearchStackParamList, 'ProductDetail'>;

export function ProductDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const dispatch = useAppDispatch();
  const wishIds = useAppSelector((s) => s.wishlist.ids);
  const product = useMemo(() => getProductById(route.params.productId), [route.params.productId]);
  const [qty, setQty] = useState(1);
  const cartPulse = useSharedValue(1);

  const cartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartPulse.value }],
  }));

  if (!product) {
    return (
      <GradientBackground>
        <Header title="Product" onBack={() => navigation.goBack()} />
        <Text style={styles.miss}>Product not found.</Text>
      </GradientBackground>
    );
  }

  const wishlisted = wishIds.includes(product.id);

  const onAdd = () => {
    dispatch(addToCart({ product, quantity: qty }));
    cartPulse.value = withSequence(withSpring(1.12), withSpring(1));
    Toast.show({ type: 'success', text1: 'Added to cart', text2: product.title });
  };

  return (
    <GradientBackground>
      <Header
        title="Details"
        onBack={() => navigation.goBack()}
        right={
          <Pressable onPress={() => dispatch(toggleWishlist(product.id))} hitSlop={10}>
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={24}
              color={colors.accent}
            />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageCard}>
          <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(13,13,13,0.95)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.category}</Text>
            </View>
            {product.originalPrice ? (
              <View style={[styles.badge, { borderColor: colors.accent }]}>
                <Text style={[styles.badgeText, { color: colors.accent }]}>Sale</Text>
              </View>
            ) : null}
          </View>
        </View>

        <Text style={styles.brand}>{product.brand ?? 'Nexus Global Trade'}</Text>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.stock}>
          {(product.stock ?? 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          {product.originalPrice ? (
            <Text style={styles.was}>{formatCurrency(product.originalPrice)}</Text>
          ) : null}
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color={colors.accent} />
            <Text style={styles.ratingText}>
              {product.rating.toFixed(1)} · {product.reviewCount} reviews
            </Text>
          </View>
        </View>

        <Text style={styles.desc}>{product.description}</Text>

        <Text style={styles.qtyLabel}>Quantity</Text>
        <View style={styles.qtyRow}>
          <Pressable style={styles.qtyBtn} onPress={() => setQty((q) => Math.max(1, q - 1))}>
            <Ionicons name="remove" size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.qty}>{qty}</Text>
          <Pressable style={styles.qtyBtn} onPress={() => setQty((q) => q + 1)}>
            <Ionicons name="add" size={20} color={colors.textPrimary} />
          </Pressable>
        </View>

        <Animated.View style={cartAnimStyle}>
          <Button title={`Add to cart · ${formatCurrency(product.price * qty)}`} onPress={onAdd} />
        </Animated.View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: 40 },
  miss: { color: colors.textSecondary, padding: spacing.lg },
  imageCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  image: { width: '100%', aspectRatio: 1.1 },
  badgeRow: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: 'rgba(13,13,13,0.65)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: { color: colors.textPrimary, fontSize: typography.caption, fontWeight: '700' },
  brand: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.h1,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  stock: { color: colors.textSecondary, fontSize: typography.caption, marginBottom: spacing.sm },
  priceRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  price: { color: colors.accent, fontSize: 26, fontWeight: '900' },
  was: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    fontSize: typography.body,
  },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 'auto' },
  ratingText: { color: colors.textSecondary, fontSize: typography.small },
  desc: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
    marginTop: spacing.md,
  },
  qtyLabel: {
    marginTop: spacing.lg,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: spacing.lg,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { color: colors.textPrimary, fontSize: typography.h2, fontWeight: '800', width: 40, textAlign: 'center' },
});
