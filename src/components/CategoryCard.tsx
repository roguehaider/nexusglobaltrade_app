import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, typography } from '../constants/theme';
import type { Category } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  category: Category;
  onPress: () => void;
};

export function CategoryCard({ category, onPress }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.96);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[styles.wrap, animatedStyle]}
    >
      <Image source={{ uri: category.image }} style={styles.image} contentFit="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(10,42,79,0.95)', 'rgba(13,13,13,0.98)']}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.label}>{category.name}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 140,
    height: 100,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  label: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: '700',
  },
});
