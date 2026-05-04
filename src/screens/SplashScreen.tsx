import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { colors, typography } from '../constants/theme';
import { store } from '../store';
import { useAppDispatch } from '../store/hooks';
import { bootstrapApp, setSplashDone } from '../store/slices/appSlice';
import { loadUser } from '../store/slices/authSlice';
import { loadCart } from '../store/slices/cartSlice';
import { loadOrders } from '../store/slices/ordersSlice';
import { loadWishlist } from '../store/slices/wishlistSlice';
import { loadAddresses } from '../store/slices/addressesSlice';
import { loadNotificationState } from '../store/slices/notificationsSlice';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await dispatch(bootstrapApp());
      await Promise.all([
        dispatch(loadUser()),
        dispatch(loadCart()),
        dispatch(loadOrders()),
        dispatch(loadWishlist()),
        dispatch(loadAddresses()),
        dispatch(loadNotificationState()),
      ]);
      await new Promise((r) => setTimeout(r, 1600));
      if (cancelled) return;
      dispatch(setSplashDone(true));
      const { app, auth } = store.getState();
      if (!app.hasCompletedOnboarding) {
        navigation.replace('Onboarding');
        return;
      }
      if (!auth.user) {
        navigation.replace('Auth', { screen: 'Login' });
        return;
      }
      navigation.replace('Main', { screen: 'HomeTab', params: { screen: 'Home' } });
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, navigation]);

  return (
    <LinearGradient
      colors={[colors.secondaryAccent, colors.background, '#050505']}
      style={styles.flex}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <LinearGradient
        colors={['rgba(255,167,38,0.25)', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
      />
      <View style={styles.center}>
        <Animated.View entering={FadeInDown.duration(700).springify()}>
          <Text style={styles.logo}>NEXUS</Text>
          <Text style={styles.tag}>Global Trade</Text>
        </Animated.View>
        <Animated.Text entering={FadeIn.delay(400)} style={styles.sub}>
          Premium commerce. Elevated.
        </Animated.Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 6,
  },
  tag: {
    marginTop: 4,
    fontSize: typography.body,
    color: colors.accent,
    letterSpacing: 3,
    textAlign: 'center',
    fontWeight: '600',
  },
  sub: {
    marginTop: 28,
    color: colors.textSecondary,
    fontSize: typography.small,
  },
});
