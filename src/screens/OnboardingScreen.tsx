import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Button } from '../components/Button';
import { colors, spacing, typography } from '../constants/theme';
import { useAppDispatch } from '../store/hooks';
import { completeOnboarding } from '../store/slices/appSlice';
import type { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    key: '1',
    title: 'Discover premium picks',
    subtitle: 'Curated catalogs inspired by global marketplaces — refined for mobile.',
    image:
      'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: '2',
    title: 'Checkout with confidence',
    subtitle: 'Transparent pricing, saved addresses, and secure mock payments.',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: '3',
    title: 'Track every order',
    subtitle: 'Real-time status, history, and delivery milestones at a glance.',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
  },
];

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      finish();
    }
  };

  const finish = async () => {
    await dispatch(completeOnboarding());
    navigation.replace('Auth', { screen: 'Login' });
  };

  return (
    <LinearGradient colors={[colors.background, '#0a1628', colors.background]} style={styles.flex}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <Animated.View entering={FadeInRight} style={styles.slide}>
              <Image source={{ uri: item.image }} style={styles.hero} />
              <LinearGradient
                colors={['transparent', colors.background]}
                style={styles.fade}
              />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.sub}>{item.subtitle}</Text>
            </Animated.View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <Button title={index === SLIDES.length - 1 ? 'Get started' : 'Continue'} onPress={next} />
        <Pressable onPress={finish} hitSlop={12}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, paddingBottom: spacing.lg },
  slide: { flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'flex-end' },
  hero: {
    position: 'absolute',
    top: 80,
    left: spacing.lg,
    right: spacing.lg,
    height: 320,
    borderRadius: 20,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 400,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  sub: { color: colors.textSecondary, fontSize: typography.body, lineHeight: 22 },
  footer: { paddingHorizontal: spacing.lg, gap: spacing.md },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.accent, width: 22 },
  skip: { color: colors.textSecondary, textAlign: 'center', fontSize: typography.small },
});
