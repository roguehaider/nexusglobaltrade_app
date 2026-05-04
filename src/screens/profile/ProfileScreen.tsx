import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { GradientBackground } from '../../components/GradientBackground';
import { ProductCard } from '../../components/ProductCard';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { products } from '../../constants/mockData';
import { navigationRef } from '../../navigation/navigationRef';
import type { ProfileStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { getProductById } from '../../utils/productFilters';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const wishIds = useAppSelector((s) => s.wishlist.ids);
  const addresses = useAppSelector((s) => s.addresses.list);

  const wishProducts = wishIds
    .map((id) => getProductById(id))
    .filter(Boolean) as typeof products;

  const onLogout = async () => {
    await dispatch(logoutUser());
    Toast.show({ type: 'info', text1: 'Signed out' });
    navigationRef.reset({ index: 0, routes: [{ name: 'Auth', params: { screen: 'Login' } }] });
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={[colors.secondaryAccent, 'transparent']}
          style={styles.hero}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() ?? 'NG'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Pressable style={styles.edit} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="create-outline" size={18} color={colors.accent} />
            <Text style={styles.editText}>Edit profile</Text>
          </Pressable>
        </LinearGradient>

        <View style={styles.stats}>
          <Stat icon="location-outline" label="Saved addresses" value={`${addresses.length}`} />
          <Stat icon="heart-outline" label="Wishlist" value={`${wishIds.length}`} />
          <Stat icon="notifications-outline" label="Alerts" value="On" />
        </View>

        <Text style={styles.section}>Wishlist</Text>
        {wishProducts.length === 0 ? (
          <Text style={styles.empty}>Save items with the heart icon to build your collection.</Text>
        ) : (
          wishProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wishlisted
              onToggleWishlist={() => dispatch(toggleWishlist(p.id))}
              onPress={() =>
                navigation
                  .getParent()
                  ?.navigate('HomeTab', { screen: 'ProductDetail', params: { productId: p.id } })
              }
            />
          ))
        )}

        <Text style={styles.section}>Account</Text>
        <MenuRow
          icon="settings-outline"
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
        <MenuRow
          icon="notifications-outline"
          label="Notifications"
          onPress={() => navigation.navigate('Notifications')}
        />
        <MenuRow icon="log-out-outline" label="Log out" danger onPress={onLogout} />
      </ScrollView>
    </GradientBackground>
  );
}

function Stat({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={20} color={colors.accent} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.menu} onPress={onPress}>
      <Ionicons name={icon} size={22} color={danger ? colors.error : colors.textPrimary} />
      <Text style={[styles.menuLabel, danger && { color: colors.error }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 120 },
  hero: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  avatarText: { color: colors.accent, fontWeight: '900', fontSize: 22 },
  name: {
    marginTop: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.h1,
    fontWeight: '800',
  },
  email: { color: colors.textSecondary, marginTop: 4 },
  edit: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md },
  editText: { color: colors.accent, fontWeight: '700' },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    gap: 8,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { color: colors.textPrimary, fontWeight: '800' },
  statLabel: { color: colors.textSecondary, fontSize: typography.caption, textAlign: 'center' },
  section: {
    color: colors.textPrimary,
    fontWeight: '800',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    fontSize: typography.h2,
  },
  empty: { color: colors.textSecondary, marginHorizontal: spacing.md, marginBottom: spacing.md },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: spacing.md,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuLabel: { flex: 1, color: colors.textPrimary, fontSize: typography.body, fontWeight: '600' },
});
