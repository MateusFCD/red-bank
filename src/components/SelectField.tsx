import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { FormField } from '@/src/components/FormField';
import { colors, fonts, radius, textMuted } from '@/src/theme/colors';

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
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <View style={styles.triggerLabel}>
          {selected?.color ? <View style={[styles.dot, { backgroundColor: selected.color }]} /> : null}
          <Text style={[styles.value, !selected && styles.placeholder]}>
            {selected ? selected.label : placeholder}
          </Text>
        </View>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.grabber} />
            <Text style={styles.title}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(o) => o.value}
              style={styles.list}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.row}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  {item.color ? <View style={[styles.dot, { backgroundColor: item.color }]} /> : null}
                  <Text style={[styles.rowLabel, item.value === value && styles.rowLabelSelected]}>
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

const styles = StyleSheet.create({
  trigger: {
    minHeight: 42,
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.md,
  },
  triggerLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  value: { fontSize: 14, color: colors.text, fontFamily: fonts.body },
  placeholder: { color: textMuted(0.45) },
  dot: { width: 8, height: 8, borderRadius: 4 },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    maxHeight: '70%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.text,
    marginBottom: 6,
  },
  list: { maxHeight: 360, flexGrow: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowLabel: { fontSize: 14.5, color: colors.text, fontFamily: fonts.body },
  rowLabelSelected: { color: colors.accent300, fontFamily: fonts.bodyMedium },
});
