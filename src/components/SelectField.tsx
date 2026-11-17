import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';

import { FormField } from '@/src/components/FormField';
import { cn } from '@/src/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  error,
  placeholder = 'Selecione…',
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <FormField label={label} error={error}>
      <Pressable
        className="min-h-[42px] justify-center py-1.5 px-3 bg-surface border border-divider rounded-md"
        onPress={() => setOpen(true)}
      >
        <View className="flex-row items-center gap-2">
          {selected?.color ? (
            <View className="w-2 h-2 rounded-[4px]" style={{ backgroundColor: selected.color }} />
          ) : null}
          <Text className={cn('text-[14px] font-body', selected ? 'text-ink' : 'text-ink/45')}>
            {selected ? selected.label : placeholder}
          </Text>
        </View>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 justify-end bg-[rgba(0,0,0,0.55)]" onPress={() => setOpen(false)}>
          <Pressable
            className="max-h-[70%] bg-surface rounded-t-xl px-5 pt-2.5 pb-7"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="w-9 h-1 rounded-[2px] bg-divider self-center mb-3" />
            <Text className="font-heading text-[17px] text-ink mb-1.5">{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(o) => o.value}
              className="max-h-[360px] grow-0"
              renderItem={({ item }) => (
                <Pressable
                  className="flex-row items-center gap-2.5 py-[13px] border-b border-b-divider"
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  {item.color ? (
                    <View className="w-2 h-2 rounded-[4px]" style={{ backgroundColor: item.color }} />
                  ) : null}
                  <Text
                    className={cn(
                      'text-[14.5px]',
                      item.value === value ? 'text-brand-300 font-body-medium' : 'text-ink font-body',
                    )}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </FormField>
  );
}
