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
import { InputField } from '../../components/InputField';
import { colors, spacing, typography } from '../../constants/theme';
import { navigationRef } from '../../navigation/navigationRef';
import type { AuthStackParamList } from '../../navigation/types';
import { useAppDispatch } from '../../store/hooks';
import { loginUser } from '../../store/slices/authSlice';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('demo@nexus.global');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Enter email and password.' });
      return;
    }
    setLoading(true);
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      Toast.show({ type: 'success', text1: 'Welcome back' });
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'HomeTab', params: { screen: 'Home' } } }],
      });
    } catch {
      Toast.show({ type: 'error', text1: 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <LinearGradient
            colors={[colors.secondaryAccentLight, 'transparent']}
            style={styles.glow}
          />
          <Text style={styles.brand}>NEXUS</Text>
          <Text style={styles.h1}>Sign in</Text>
          <Text style={styles.muted}>Access your premium storefront experience.</Text>
          <View style={{ height: spacing.xl }} />
          <InputField
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <InputField label="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            Forgot password?
          </Text>
          <Button title={loading ? 'Signing in…' : 'Continue'} onPress={onSubmit} disabled={loading} />
          <Text style={styles.footer}>
            New here?{' '}
            <Text style={styles.linkStrong} onPress={() => navigation.navigate('Signup')}>
              Create an account
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingTop: 72 },
  glow: {
    position: 'absolute',
    top: -40,
    left: -80,
    right: -80,
    height: 220,
    opacity: 0.6,
  },
  brand: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 8,
  },
  h1: {
    marginTop: spacing.lg,
    fontSize: typography.title,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  muted: { color: colors.textSecondary, marginTop: spacing.sm, fontSize: typography.body },
  link: {
    color: colors.accent,
    textAlign: 'right',
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  footer: { marginTop: spacing.lg, color: colors.textSecondary, textAlign: 'center' },
  linkStrong: { color: colors.accent, fontWeight: '700' },
});
