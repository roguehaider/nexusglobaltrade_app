import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button } from '../../components/Button';
import { GradientBackground } from '../../components/GradientBackground';
import { Header } from '../../components/Header';
import { InputField } from '../../components/InputField';
import { spacing } from '../../constants/theme';
import type { ProfileStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateUserProfile } from '../../store/slices/authSlice';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

export function EditProfileScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!user) return;
    if (!name.trim() || !email.trim()) {
      Toast.show({ type: 'error', text1: 'Name and email required' });
      return;
    }
    setLoading(true);
    try {
      await dispatch(
        updateUserProfile({
          id: user.id,
          name,
          email,
          phone,
        }),
      ).unwrap();
      Toast.show({ type: 'success', text1: 'Profile updated' });
      navigation.goBack();
    } catch {
      Toast.show({ type: 'error', text1: 'Could not update' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <Header title="Edit profile" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <InputField label="Full name" value={name} onChangeText={setName} />
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Button title={loading ? 'Saving…' : 'Save changes'} onPress={save} disabled={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: spacing.md, paddingBottom: 48 },
});
