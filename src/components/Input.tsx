import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { colors, textMuted } from '@/src/theme/colors';
import { cn } from '@/src/utils/cn';

export const Input = forwardRef<TextInput, TextInputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <TextInput
      ref={ref}
      placeholderTextColor={textMuted(0.45)}
      selectionColor={colors.accent}
      className={cn(
        'w-full min-h-[42px] py-1.5 px-3 text-[14px] text-ink bg-surface border border-divider rounded-md font-body',
        className,
      )}
      {...props}
    />
  );
});
