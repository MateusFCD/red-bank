import { forwardRef } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { colors, fonts, radius, textMuted } from '@/src/theme/colors';

export const Input = forwardRef<TextInput, TextInputProps>(function Input(
  { style, ...props },
  ref,
) {
  return (
    <TextInput
      ref={ref}
      placeholderTextColor={textMuted(0.45)}
      selectionColor={colors.accent}
      style={[styles.input, style]}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    width: '100%',
    minHeight: 42,
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.md,
    fontFamily: fonts.body,
  },
});
