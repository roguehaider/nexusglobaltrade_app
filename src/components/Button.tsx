import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, radius, typography } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
  icon,
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bg =
    variant === 'primary'
      ? colors.accent
      : 'transparent';
  const borderColor = variant === 'outline' ? colors.accent : 'transparent';
  const color =
    variant === 'primary' ? '#0D0D0D' : variant === 'outline' ? colors.accent : colors.textPrimary;

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
      disabled={Boolean(disabled)}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: variant === 'outline' ? borderColor : 'transparent',
          opacity: disabled ? 0.45 : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.text, { color }]}>{title}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.lg,
  },
  text: {
    fontSize: typography.body,
    fontWeight: '700',
  },
});
