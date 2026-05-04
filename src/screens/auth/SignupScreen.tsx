import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
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
import { navigationRef } from '../../navigation/navigationRef';
import type { AuthStackParamList } from '../../navigation/types';
import { useAppDispatch } from '../../store/hooks';
import { signupUser } from '../../store/slices/authSlice';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export function SignupScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      Toast.show({ type: 'error', text1: 'Complete all fields' });
      return;
    }
    setLoading(true);
    try {
      await dispatch(signupUser({ name, email, phone, password })).unwrap();
      Toast.show({ type: 'success', text1: 'Account created' });
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'HomeTab', params: { screen: 'Home' } } }],
      });
    } catch {
      Toast.show({ type: 'error', text1: 'Could not sign up' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <Header title="Create account" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <LinearGradient
            colors={[colors.secondaryAccentLight, 'transparent']}
            style={styles.glow}
          />
          <Text style={styles.lead}>Join Nexus Global Trade</Text>
          <InputField label="Full name" value={name} onChangeText={setName} />
          <InputField
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <InputField label="Phone" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <InputField label="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <Button title={loading ? 'Creating…' : 'Sign up'} onPress={onSubmit} disabled={loading} />
          <Text style={styles.footer}>
            Already have an account?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
              Sign in
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: 48 },
  glow: {
    position: 'absolute',
    top: -60,
    left: -60,
    right: -60,
    height: 200,
    opacity: 0.5,
  },
  lead: {
    color: colors.textPrimary,
    fontSize: typography.h1,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  footer: { marginTop: spacing.md, color: colors.textSecondary, textAlign: 'center' },
  link: { color: colors.accent, fontWeight: '700' },
});
