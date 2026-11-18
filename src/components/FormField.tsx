import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

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
    <View className="w-full">
      <Text className="text-[12px] mb-[5px] text-ink/70 font-body">{label}</Text>
      {children}
      {error ? <Text className="text-brand-400 text-[11.5px] mt-[5px] font-body">{error}</Text> : null}
    </View>
  );
}
