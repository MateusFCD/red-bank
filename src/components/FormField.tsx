import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, textMuted } from '@/src/theme/colors';

export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { width: '100%' },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: textMuted(0.7),
    fontFamily: fonts.body,
  },
  error: {
    color: colors.accent400,
    fontSize: 11.5,
    marginTop: 5,
    fontFamily: fonts.body,
  },
});
