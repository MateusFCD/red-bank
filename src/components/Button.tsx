import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import { cn } from '@/src/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: Variant;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  /** Classes Tailwind do label (ex.: `text-brand-400`); substitui a cor da variante. */
  textClassName?: string;
  /**
   * Classes extras do container. Para sobrescrever algo que a variante já
   * define (alignSelf, borderColor…), use o modificador `!` (ex.: `!self-end`).
   */
  className?: string;
}

const variantClass: Record<Variant, string> = {
  primary: 'py-2.5 px-4 border-transparent bg-brand',
  secondary: 'py-2.5 px-4 border-divider',
  ghost: 'px-0 py-0 border-transparent self-start',
};

const pressedClass: Record<Variant, string> = {
  primary: 'active:bg-brand-600',
  secondary: 'active:bg-ink/7',
  ghost: 'active:opacity-70',
};

const labelColorClass: Record<Variant, string> = {
  primary: 'text-app',
  secondary: 'text-ink',
  ghost: 'text-brand',
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  block = false,
  disabled = false,
  loading = false,
  icon,
  textClassName,
  className,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={cn(
        'rounded-md border items-center justify-center',
        variantClass[variant],
        block && 'w-full',
        !isDisabled && pressedClass[variant],
        isDisabled && 'opacity-[0.45]',
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? colors.bg : colors.text} />
      ) : (
        <View className="flex-row items-center justify-center gap-1.5">
          {icon}
          <Text className={cn('font-heading text-[14px]', textClassName ?? labelColorClass[variant])}>
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
