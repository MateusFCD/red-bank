import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Pressable, View } from 'react-native';

import { FormField } from '@/src/components/FormField';
import { Input } from '@/src/components/Input';
import { formatDateDisplay } from '@/src/utils/format';

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

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');

    onChange(`${year}-${month}-${day}`);
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
          value={value ? new Date(`${value}T12:00:00`) : new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </FormField>
  );
}
