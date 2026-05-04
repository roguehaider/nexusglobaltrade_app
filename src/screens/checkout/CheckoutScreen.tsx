import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Button } from '../../components/Button';
import { GradientBackground } from '../../components/GradientBackground';
import { Header } from '../../components/Header';
import { InputField } from '../../components/InputField';
import { colors, spacing, typography } from '../../constants/theme';
import type { CartStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addAddress } from '../../store/slices/addressesSlice';
import type { Address } from '../../types';

type Nav = NativeStackNavigationProp<CartStackParamList>;
type R = RouteProp<CartStackParamList, 'Checkout'>;

export function CheckoutScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const dispatch = useAppDispatch();
  const saved = useAppSelector((s) => s.addresses.list);
  const user = useAppSelector((s) => s.auth.user);

  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState(user?.name ?? '');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [phone, setPhone] = useState(user?.phone ?? '');

  const submit = () => {
    if (!fullName.trim() || !line1.trim() || !city.trim() || !postal.trim() || !phone.trim()) {
      Toast.show({ type: 'error', text1: 'Fill required address fields' });
      return;
    }
    const addr: Address = {
      id: `addr_${Date.now()}`,
      label,
      fullName: fullName.trim(),
      line1: line1.trim(),
      line2: line2.trim() || undefined,
      city: city.trim(),
      postalCode: postal.trim(),
      phone: phone.trim(),
      isDefault: saved.length === 0,
    };
    dispatch(addAddress(addr));
    navigation.navigate('Payment', {
      ...route.params,
      address: addr,
    });
  };

  const useSaved = (a: Address) => {
    setLabel(a.label);
    setFullName(a.fullName);
    setLine1(a.line1);
    setLine2(a.line2 ?? '');
    setCity(a.city);
    setPostal(a.postalCode);
    setPhone(a.phone);
    Toast.show({ type: 'info', text1: 'Address loaded', text2: a.label });
  };

  return (
    <GradientBackground>
      <Header title="Checkout" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {saved.length > 0 ? (
            <View style={styles.saved}>
              <Text style={styles.section}>Saved addresses</Text>
              {saved.map((a) => (
                <Text key={a.id} style={styles.savedLink} onPress={() => useSaved(a)}>
                  {a.label} — {a.city}
                </Text>
              ))}
            </View>
          ) : null}

          <Text style={styles.section}>Shipping address</Text>
          <InputField label="Label" value={label} onChangeText={setLabel} placeholder="Home, Office…" />
          <InputField label="Full name" value={fullName} onChangeText={setFullName} />
          <InputField label="Address line 1" value={line1} onChangeText={setLine1} />
          <InputField label="Address line 2 (optional)" value={line2} onChangeText={setLine2} />
          <InputField label="City" value={city} onChangeText={setCity} />
          <InputField label="Postal code" value={postal} onChangeText={setPostal} />
          <InputField label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <Button title="Continue to payment" onPress={submit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: spacing.md, paddingBottom: 48 },
  section: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    fontSize: typography.body,
  },
  saved: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  savedLink: { color: colors.accent, marginVertical: 4, fontWeight: '600' },
});
