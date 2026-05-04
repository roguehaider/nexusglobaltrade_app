import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button } from '../../components/Button';
import { GradientBackground } from '../../components/GradientBackground';
import { Header } from '../../components/Header';
import { InputField } from '../../components/InputField';
import { colors, spacing, typography } from '../../constants/theme';
import type { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export function ForgotPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = () => {
    if (!email.trim()) {
      Toast.show({ type: 'error', text1: 'Enter your email' });
      return;
    }
    setSent(true);
    Toast.show({
      type: 'success',
      text1: 'Reset link sent',
      text2: 'Check your inbox (mock).',
    });
  };

  return (
    <GradientBackground>
      <Header title="Forgot password" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.lead}>
            {sent
              ? 'If an account exists for that email, you will receive reset instructions.'
              : 'Enter your email and we will send a secure reset link.'}
          </Text>
          <InputField
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Button title={sent ? 'Resend email' : 'Send reset link'} onPress={onSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: spacing.lg },
  lead: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
});
