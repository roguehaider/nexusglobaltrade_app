import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { GradientBackground } from '../../components/GradientBackground';
import { colors, spacing, typography } from '../../constants/theme';
import type { CartStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<CartStackParamList>;
type R = RouteProp<CartStackParamList, 'OrderSuccess'>;

export function OrderSuccessScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();

  return (
    <GradientBackground>
      <View style={styles.center}>
        <LinearGradient colors={[colors.accentMuted, 'transparent']} style={styles.glow} />
        <Animated.View entering={FadeInDown.springify()} style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={56} color={colors.accent} />
        </Animated.View>
        <Text style={styles.title}>Order confirmed</Text>
        <Text style={styles.sub}>
          Thank you for shopping with Nexus Global Trade. Your order{' '}
          <Text style={styles.bold}>{route.params.orderId}</Text> is being prepared.
        </Text>
        <Button
          title="Track orders"
          onPress={() =>
            navigation.getParent()?.navigate('OrdersTab', { screen: 'OrderHistory' })
          }
          style={{ marginTop: spacing.xl, alignSelf: 'stretch' }}
        />
        <Button
          title="Back to home"
          variant="outline"
          onPress={() =>
            navigation.getParent()?.navigate('HomeTab', { screen: 'Home' })
          }
          style={{ marginTop: 12, alignSelf: 'stretch' }}
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    top: 80,
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.5,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: '800',
    textAlign: 'center',
  },
  sub: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  bold: { color: colors.accent, fontWeight: '800' },
});
