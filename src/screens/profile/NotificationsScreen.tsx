import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { GradientBackground } from '../../components/GradientBackground';
import { Header } from '../../components/Header';
import { colors, radius, spacing, typography } from '../../constants/theme';
import type { ProfileStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { markAllRead, markRead } from '../../store/slices/notificationsSlice';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

export function NotificationsScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.notifications.items);

  return (
    <GradientBackground>
      <Header
        title="Notifications"
        onBack={() => navigation.goBack()}
        right={
          <Pressable onPress={() => dispatch(markAllRead())} hitSlop={10}>
            <Text style={styles.mark}>Mark all read</Text>
          </Pressable>
        }
      />
      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, !item.read && styles.unread]}
            onPress={() => dispatch(markRead(item.id))}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </Pressable>
        )}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  mark: { color: colors.accent, fontWeight: '700', fontSize: typography.small },
  list: { padding: spacing.md, paddingBottom: 80 },
  card: {
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    marginBottom: 10,
  },
  unread: { borderColor: colors.accent, backgroundColor: colors.accentMuted },
  title: { color: colors.textPrimary, fontWeight: '700', fontSize: typography.body },
  body: { color: colors.textSecondary, marginTop: 6, lineHeight: 22 },
  time: { color: colors.textSecondary, marginTop: 8, fontSize: typography.caption },
});
