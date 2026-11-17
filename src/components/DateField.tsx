import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Pressable, View } from 'react-native';

import { FormField } from '@/src/components/FormField';
import { Input } from '@/src/components/Input';
import { dateToIso, formatDateDisplay, isoToDate } from '@/src/utils/format';

export function DateField({
  label,
  value,
  onChange,
  placeholder = 'Selecione',
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);

  function handleChange(event: { type?: string }, selectedDate?: Date) {
    setOpen(false);

    if (Platform.OS === 'android' && event.type === 'dismissed') return;
    if (!selectedDate) return;

    onChange(dateToIso(selectedDate));
  }

  return (
    <FormField label={label} error={error}>
      <Pressable onPress={() => setOpen(true)}>
        <View pointerEvents="none">
          <Input
            placeholder={placeholder}
            value={value ? formatDateDisplay(value) : ''}
            editable={false}
          />
        </View>
      </Pressable>

      {open && (
        <DateTimePicker
          value={isoToDate(value)}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </FormField>
  );
}
