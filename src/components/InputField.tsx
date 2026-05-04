import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, typography } from '../constants/theme';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function InputField({ label, error, style, secureTextEntry, ...rest }: Props) {
  const [hidden, setHidden] = useState(true);
  const isSecure = !!secureTextEntry;
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, error ? styles.fieldError : null]}>
        <TextInput
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, style]}
          {...rest}
          secureTextEntry={isSecure ? hidden : false}
        />
        {isSecure ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8} style={styles.toggle}>
            <Text style={styles.toggleText}>{hidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: {
    color: colors.textSecondary,
    fontSize: typography.small,
    marginBottom: 6,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingRight: 8,
  },
  fieldError: { borderColor: colors.error },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  toggle: { paddingHorizontal: 8, paddingVertical: 10 },
  toggleText: { color: colors.accent, fontSize: typography.small, fontWeight: '600' },
  error: { color: colors.error, fontSize: typography.caption, marginTop: 4 },
});
