import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button } from '../../components/Button';
import { GradientBackground } from '../../components/GradientBackground';
import { Header } from '../../components/Header';
import { InputField } from '../../components/InputField';
import { colors, spacing, typography } from '../../constants/theme';
import type { CartStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearCart } from '../../store/slices/cartSlice';
import { addOrder } from '../../store/slices/ordersSlice';
import { formatCurrency, generateOrderId } from '../../utils/format';
import type { Order, OrderItem } from '../../types';

type Nav = NativeStackNavigationProp<CartStackParamList>;
type R = RouteProp<CartStackParamList, 'Payment'>;

export function PaymentScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const [method, setMethod] = useState<'card' | 'cod'>('card');
  const [cardName, setCardName] = useState('Nexus Cardholder');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [exp, setExp] = useState('12/30');
  const [cvv, setCvv] = useState('123');

  const { subtotal, shipping, total, address } = route.params;

  const placeOrder = () => {
    if (method === 'card' && (!cardNumber.trim() || !exp.trim() || !cvv.trim())) {
      Toast.show({ type: 'error', text1: 'Enter card details' });
      return;
    }
    if (items.length === 0) {
      Toast.show({ type: 'error', text1: 'Cart is empty' });
      return;
    }
    const orderItems: OrderItem[] = items.map((i) => ({
      productId: i.product.id,
      title: i.product.title,
      price: i.product.price,
      quantity: i.quantity,
      image: i.product.image,
    }));
    const order: Order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      status: 'Pending',
      items: orderItems,
      subtotal,
      shipping,
      total,
      address,
      paymentMethod: method === 'card' ? 'Card ending •••• 4242' : 'Cash on delivery',
    };
    dispatch(addOrder(order));
    dispatch(clearCart());
    Toast.show({ type: 'success', text1: 'Order placed' });
    navigation.reset({
      index: 0,
      routes: [{ name: 'OrderSuccess', params: { orderId: order.id } }],
    });
  };

  return (
    <GradientBackground>
      <Header title="Payment" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.label}>Deliver to</Text>
          <Text style={styles.addr}>
            {address.fullName}
            {'\n'}
            {address.line1}
            {address.line2 ? `\n${address.line2}` : ''}
            {'\n'}
            {address.city}, {address.postalCode}
            {'\n'}
            {address.phone}
          </Text>
          <View style={styles.divider} />
          <Row label="Subtotal" value={formatCurrency(subtotal)} />
          <Row label="Shipping" value={shipping === 0 ? 'Free' : formatCurrency(shipping)} />
          <Row label="Total" value={formatCurrency(total)} bold />
        </View>

        <Text style={styles.section}>Payment method</Text>
        <View style={styles.methods}>
          <MethodChip active={method === 'card'} label="Card" onPress={() => setMethod('card')} />
          <MethodChip active={method === 'cod'} label="Cash on delivery" onPress={() => setMethod('cod')} />
        </View>

        {method === 'card' ? (
          <>
            <InputField label="Name on card" value={cardName} onChangeText={setCardName} />
            <InputField label="Card number" value={cardNumber} onChangeText={setCardNumber} keyboardType="number-pad" />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputField label="Expiry" value={exp} onChangeText={setExp} />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <InputField label="CVV" value={cvv} onChangeText={setCvv} keyboardType="number-pad" secureTextEntry />
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.hint}>Pay with cash when your order arrives. Courier will confirm.</Text>
        )}

        <Button title={`Pay ${formatCurrency(total)}`} onPress={placeOrder} />
      </ScrollView>
    </GradientBackground>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.line}>
      <Text style={[styles.muted, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.val, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

function MethodChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.method, active && styles.methodActive]}>
      <Text style={[styles.methodText, active && styles.methodTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: 48 },
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  label: { color: colors.textSecondary, marginBottom: 6, fontSize: typography.small },
  addr: { color: colors.textPrimary, lineHeight: 22 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  line: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  muted: { color: colors.textSecondary, fontSize: typography.small },
  val: { color: colors.textPrimary, fontSize: typography.small },
  bold: { fontWeight: '800', fontSize: typography.body },
  section: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  methods: { flexDirection: 'row', gap: 10, marginBottom: spacing.md },
  method: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  methodActive: { borderColor: colors.accent, backgroundColor: colors.accentMuted },
  methodText: { color: colors.textSecondary, fontWeight: '600' },
  methodTextActive: { color: colors.accent },
  row: { flexDirection: 'row' },
  hint: { color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 22 },
});
