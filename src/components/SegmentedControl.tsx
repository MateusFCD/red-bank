import { Pressable, Text, View } from 'react-native';

import { cn } from '@/src/utils/cn';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <View className={cn('flex-row self-start rounded-md border border-divider overflow-hidden', className)}>
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={cn('py-[7px] px-3', i > 0 && 'border-l border-l-divider', selected && 'bg-brand')}
          >
            <Text
              className={cn(
                'text-[13px]',
                selected ? 'text-app font-body-medium' : 'text-ink font-body',
              )}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
