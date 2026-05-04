import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = { fullScreen?: boolean };

export function Loader({ fullScreen }: Props) {
  return (
    <View style={[styles.wrap, fullScreen && styles.full]}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  full: { flex: 1, backgroundColor: colors.background },
});
