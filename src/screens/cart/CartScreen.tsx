import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { GradientBackground } from '../../components/GradientBackground';
import { Header } from '../../components/Header';
import { colors, radius, shadows, spacing, typography } from '../../constants/theme';
import type { CartStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { decrement, increment, removeFromCart } from '../../store/slices/cartSlice';
import { formatCurrency } from '../../utils/format';
import type { CartItem } from '../../types';

type Nav = NativeStackNavigationProp<CartStackParamList>;

export function CartScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 200 ? 0 : 12.99) : 0;
  const total = subtotal + shipping;

  const renderItem = ({ item, index }: { item: CartItem; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 60)}>
      <View style={[styles.card, shadows.soft]}>
        <Image source={{ uri: item.product.image }} style={styles.thumb} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.product.title}
          </Text>
          <Text style={styles.price}>{formatCurrency(item.product.price)}</Text>
          <View style={styles.qtyRow}>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => dispatch(decrement(item.product.id))}
            >
              <Ionicons name="remove" size={18} color={colors.textPrimary} />
            </Pressable>
            <Text style={styles.qty}>{item.quantity}</Text>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => dispatch(increment(item.product.id))}
            >
              <Ionicons name="add" size={18} color={colors.textPrimary} />
            </Pressable>
            <Pressable
              style={styles.trash}
              onPress={() => dispatch(removeFromCart(item.product.id))}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  if (items.length === 0) {
    return (
      <GradientBackground>
        <Header title="Cart" />
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          message="Add items from home or search to see them here."
          actionLabel="Browse home"
          onAction={() =>
            navigation.getParent()?.navigate('HomeTab', { screen: 'Home' })
          }
        />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <Header title="Cart" subtitle={`${items.length} items`} />
      <FlatList
        data={items}
        keyExtractor={(i) => i.product.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
      />
      <View style={styles.summary}>
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        <Row label="Shipping" value={shipping === 0 ? 'Free' : formatCurrency(shipping)} />
        <View style={styles.divider} />
        <Row label="Total" value={formatCurrency(total)} bold />
        <Button
          title="Checkout"
          onPress={() =>
            navigation.navigate('Checkout', {
              subtotal,
              shipping,
              total,
            })
          }
        />
      </View>
    </GradientBackground>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, paddingBottom: 240 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  thumb: { width: 96, height: 96 },
  info: { flex: 1, padding: 12, justifyContent: 'space-between' },
  title: { color: colors.textPrimary, fontWeight: '600', fontSize: typography.small },
  price: { color: colors.accent, fontWeight: '800', marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qty: { color: colors.textPrimary, fontWeight: '700', width: 24, textAlign: 'center' },
  trash: { marginLeft: 'auto' },
  summary: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    paddingBottom: 28,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { color: colors.textSecondary, fontSize: typography.small },
  rowValue: { color: colors.textPrimary, fontSize: typography.small },
  bold: { fontWeight: '800', fontSize: typography.body },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
});
