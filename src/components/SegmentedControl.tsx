import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius } from '@/src/theme/colors';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: object;
}) {
  return (
    <View style={[styles.seg, style]}>
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.opt, i > 0 && styles.optDivider, selected && styles.optSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  seg: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
  },
  opt: {
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  optDivider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.divider,
  },
  optSelected: {
    backgroundColor: colors.accent,
  },
  label: {
    fontSize: 13,
    color: colors.text,
    fontFamily: fonts.body,
  },
  labelSelected: {
    color: colors.bg,
    fontFamily: fonts.bodyMedium,
  },
});
