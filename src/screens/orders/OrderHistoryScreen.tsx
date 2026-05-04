import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { GradientBackground } from '../../components/GradientBackground';
import { Header } from '../../components/Header';
import { colors, radius, spacing, typography } from '../../constants/theme';
import type { OrdersStackParamList } from '../../navigation/types';
import { useAppSelector } from '../../store/hooks';
import { formatCurrency } from '../../utils/format';
import type { Order, OrderStatus } from '../../types';

type Nav = NativeStackNavigationProp<OrdersStackParamList>;

const statusColor: Record<OrderStatus, string> = {
  Pending: colors.accent,
  Shipped: '#42A5F5',
  Delivered: colors.success,
  Cancelled: colors.textSecondary,
};

export function OrderHistoryScreen() {
  const navigation = useNavigation<Nav>();
  const orders = useAppSelector((s) => s.orders.orders);

  if (orders.length === 0) {
    return (
      <GradientBackground>
        <Header title="Orders" />
        <EmptyState
          icon="receipt-outline"
          title="No orders yet"
          message="When you place an order, it will appear here with live status."
          actionLabel="Start shopping"
          onAction={() =>
            navigation.getParent()?.navigate('HomeTab', { screen: 'Home' })
          }
        />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <Header title="Orders" subtitle={`${orders.length} total`} />
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
          >
            <View style={styles.row}>
              <Text style={styles.id}>{item.id}</Text>
              <View style={[styles.pill, { borderColor: statusColor[item.status] }]}>
                <Text style={[styles.pillText, { color: statusColor[item.status] }]}>
                  {item.status}
                </Text>
              </View>
            </View>
            <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
            <View style={styles.footer}>
              <Text style={styles.items}>{item.items.length} items</Text>
              <Text style={styles.total}>{formatCurrency(item.total)}</Text>
            </View>
          </Pressable>
        )}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, paddingBottom: 100 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { color: colors.textPrimary, fontWeight: '800', fontSize: typography.body },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: { fontSize: typography.caption, fontWeight: '700' },
  date: { color: colors.textSecondary, marginTop: 6, fontSize: typography.caption },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
  },
  items: { color: colors.textSecondary, fontSize: typography.small },
  total: { color: colors.accent, fontWeight: '800' },
});
