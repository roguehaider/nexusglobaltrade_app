import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppModal } from '../../components/AppModal';
import { Button } from '../../components/Button';
import { GradientBackground } from '../../components/GradientBackground';
import { Header } from '../../components/Header';
import { colors, radius, spacing, typography } from '../../constants/theme';
import type { OrdersStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { cancelOrder } from '../../store/slices/ordersSlice';
import { formatCurrency } from '../../utils/format';

type Nav = NativeStackNavigationProp<OrdersStackParamList>;
type R = RouteProp<OrdersStackParamList, 'OrderDetail'>;

export function OrderDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const dispatch = useAppDispatch();
  const order = useAppSelector((s) => s.orders.orders.find((o) => o.id === route.params.orderId));
  const [showCancel, setShowCancel] = useState(false);

  const canCancel = order?.status === 'Pending';

  const addrText = useMemo(() => {
    if (!order) return '';
    const a = order.address;
    return `${a.fullName}\n${a.line1}${a.line2 ? `\n${a.line2}` : ''}\n${a.city}, ${a.postalCode}\n${a.phone}`;
  }, [order]);

  if (!order) {
    return (
      <GradientBackground>
        <Header title="Order" onBack={() => navigation.goBack()} />
        <Text style={styles.miss}>Order not found.</Text>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <Header title="Order detail" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.head}>
          <Text style={styles.id}>{order.id}</Text>
          <Text style={styles.status}>{order.status}</Text>
          <Text style={styles.date}>{new Date(order.date).toLocaleString()}</Text>
        </View>

        <Text style={styles.section}>Items</Text>
        {order.items.map((it) => (
          <View key={it.productId + String(it.quantity)} style={styles.lineItem}>
            <Image source={{ uri: it.image }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itTitle} numberOfLines={2}>
                {it.title}
              </Text>
              <Text style={styles.meta}>
                Qty {it.quantity} · {formatCurrency(it.price)}
              </Text>
            </View>
            <Text style={styles.itTotal}>{formatCurrency(it.price * it.quantity)}</Text>
          </View>
        ))}

        <Text style={styles.section}>Shipping</Text>
        <Text style={styles.addr}>{addrText}</Text>

        <Text style={styles.section}>Payment</Text>
        <Text style={styles.addr}>{order.paymentMethod}</Text>

        <View style={styles.totals}>
          <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
          <Row label="Shipping" value={formatCurrency(order.shipping)} />
          <Row label="Total" value={formatCurrency(order.total)} bold />
        </View>

        {canCancel ? (
          <Button title="Cancel order" variant="outline" onPress={() => setShowCancel(true)} />
        ) : null}
      </ScrollView>

      <AppModal
        visible={showCancel}
        title="Cancel this order?"
        message="This will mark your order as cancelled. Mock demo — no refunds processed."
        confirmLabel="Cancel order"
        destructive
        onClose={() => setShowCancel(false)}
        onConfirm={() => dispatch(cancelOrder(order.id))}
      />
    </GradientBackground>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.rVal, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: 48 },
  miss: { color: colors.textSecondary, padding: spacing.lg },
  head: {
    backgroundColor: colors.backgroundSecondary,
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  id: { color: colors.textPrimary, fontWeight: '900', fontSize: typography.h1 },
  status: { color: colors.accent, fontWeight: '700', marginTop: 4 },
  date: { color: colors.textSecondary, marginTop: 6, fontSize: typography.caption },
  section: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  lineItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: { width: 56, height: 56, borderRadius: 10 },
  itTitle: { color: colors.textPrimary, fontWeight: '600' },
  meta: { color: colors.textSecondary, marginTop: 4, fontSize: typography.caption },
  itTotal: { color: colors.accent, fontWeight: '800' },
  addr: { color: colors.textSecondary, lineHeight: 22 },
  totals: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    gap: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rLabel: { color: colors.textSecondary, fontSize: typography.small },
  rVal: { color: colors.textPrimary, fontSize: typography.small },
  bold: { fontWeight: '800', fontSize: typography.body },
});
