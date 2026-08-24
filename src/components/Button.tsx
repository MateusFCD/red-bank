import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius } from '@/src/theme/colors';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: Variant;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  textColor?: string;
  style?: object;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  block = false,
  disabled = false,
  loading = false,
  icon,
  textColor,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        block && styles.block,
        pressed && !isDisabled && (variant === 'primary' ? styles.primaryPressed : variant === 'secondary' ? styles.secondaryPressed : styles.ghostPressed),
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? colors.bg : colors.text} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              styles.label,
              variant === 'primary' && { color: colors.bg },
              variant === 'secondary' && { color: colors.text },
              variant === 'ghost' && { color: colors.accent },
              textColor ? { color: textColor } : null,
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    fontFamily: fonts.heading,
    fontSize: 14,
  },
  primary: { backgroundColor: colors.accent },
  primaryPressed: { backgroundColor: colors.accent600 },
  secondary: { borderColor: colors.divider },
  secondaryPressed: { backgroundColor: 'rgba(245, 243, 240, 0.07)' },
  ghost: { paddingHorizontal: 0, paddingVertical: 0, alignSelf: 'flex-start' },
  ghostPressed: { opacity: 0.7 },
  block: { width: '100%' },
  disabled: { opacity: 0.45 },
});
