import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { GradientBackground } from '../../components/GradientBackground';
import { Header } from '../../components/Header';
import { colors, spacing, typography } from '../../constants/theme';
import type { ProfileStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const [push, setPush] = useState(true);
  const [emailOffers, setEmailOffers] = useState(false);

  return (
    <GradientBackground>
      <Header title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.section}>Experience</Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Dark premium theme</Text>
            <Text style={styles.hint}>Always on — crafted for Nexus Global Trade.</Text>
          </View>
          <Switch
            value={true}
            disabled={true}
            trackColor={{ false: colors.border, true: colors.accent }}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Push notifications</Text>
          <Switch
            value={push}
            onValueChange={(v) => {
              setPush(v);
              Toast.show({ type: 'info', text1: v ? 'Alerts on' : 'Alerts muted (mock)' });
            }}
            trackColor={{ false: colors.border, true: colors.accent }}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email offers</Text>
          <Switch
            value={emailOffers}
            onValueChange={setEmailOffers}
            trackColor={{ false: colors.border, true: colors.accent }}
          />
        </View>

        <Text style={styles.section}>Support</Text>
        <Pressable
          style={styles.link}
          onPress={() => Toast.show({ type: 'info', text1: 'Help center', text2: 'Mock entry point.' })}
        >
          <Text style={styles.linkText}>Help center</Text>
        </Pressable>
        <Pressable
          style={styles.link}
          onPress={() =>
            Toast.show({ type: 'info', text1: 'Nexus Global Trade', text2: 'Frontend demo build.' })
          }
        >
          <Text style={styles.linkText}>About</Text>
        </Pressable>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: 48 },
  section: {
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    letterSpacing: 1,
    fontSize: typography.caption,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: { color: colors.textPrimary, fontWeight: '600', fontSize: typography.body },
  hint: { color: colors.textSecondary, fontSize: typography.caption, marginTop: 4 },
  link: { paddingVertical: 14 },
  linkText: { color: colors.accent, fontWeight: '700', fontSize: typography.body },
});
