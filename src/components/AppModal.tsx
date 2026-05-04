import { BlurView } from 'expo-blur';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors, radius, typography } from '../constants/theme';
import { Button } from './Button';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  destructive?: boolean;
};

export function AppModal({
  visible,
  title,
  message,
  confirmLabel = 'OK',
  onConfirm,
  onClose,
  destructive,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)} style={styles.center}>
          <Pressable onPress={(e) => e.stopPropagation?.()}>
            <BlurView intensity={40} tint="dark" style={styles.card}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.msg}>{message}</Text>
              <View style={styles.actions}>
                <Button title="Cancel" onPress={onClose} variant="ghost" style={styles.btn} />
                <Button
                  title={confirmLabel}
                  onPress={() => {
                    onConfirm();
                    onClose();
                  }}
                  variant="primary"
                  style={[styles.btn, destructive && { backgroundColor: colors.error }]}
                />
              </View>
            </BlurView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: 24,
  },
  center: { flex: 1, justifyContent: 'center' },
  card: {
    borderRadius: radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: 'rgba(26,26,26,0.92)',
  },
  title: { color: colors.textPrimary, fontSize: typography.h2, fontWeight: '700' },
  msg: { color: colors.textSecondary, marginTop: 10, fontSize: typography.body, lineHeight: 22 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  btn: { flex: 1 },
});
