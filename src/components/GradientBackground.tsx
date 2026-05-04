import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function GradientBackground({ children, style }: Props) {
  return (
    <LinearGradient
      colors={[colors.secondaryAccent, colors.background, '#0a0a0a']}
      locations={[0, 0.35, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.flex, style]}
    >
      <LinearGradient
        colors={['rgba(255,167,38,0.08)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.45 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
