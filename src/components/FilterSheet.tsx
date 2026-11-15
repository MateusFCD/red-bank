import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/src/components/Button';
import { DateField } from '@/src/components/DateField';
import { FormField } from '@/src/components/FormField';
import { Input } from '@/src/components/Input';
import { SegmentedControl, type SegmentOption } from '@/src/components/SegmentedControl';
import { XIcon } from '@/src/components/icons';
import { catColor } from '@/src/data/categories';
import { useTransactionFilters } from '@/src/hooks/useTransactionFilters';
import type { FilterType } from '@/src/interfaces';
import { colors } from '@/src/theme/colors';
import { cn } from '@/src/utils/cn';

const TYPE_OPTIONS: SegmentOption<FilterType>[] = [
  { value: 'all', label: 'Todas' },
  { value: 'income', label: 'Receitas' },
  { value: 'expense', label: 'Despesas' },
];

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Categorias disponíveis para filtrar. */
  categories: string[];
}

function CategoryChip({
  name,
  selected,
  onPress,
}: {
  name: string;
  selected: boolean;
  onPress: () => void;
}) {
  const color = catColor(name);

  return (
    <Pressable
      onPress={onPress}
      className={cn('rounded-pill border py-[3px] px-2.5', !selected && 'bg-transparent border-divider')}
      // Cor da categoria é calculada em runtime.
      style={selected ? { backgroundColor: color, borderColor: color } : undefined}
    >
      <Text className={cn('text-[11px]', selected ? 'text-app font-body-medium' : 'text-ink font-body')}>
        {name}
      </Text>
    </Pressable>
  );
}

export function FilterSheet({ visible, onClose, categories }: FilterSheetProps) {
  const { filters, setFilter, toggleCategory, clearFilters } = useTransactionFilters();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-[rgba(0,0,0,0.55)]" onPress={onClose}>
        <Pressable
          className="max-h-[86%] bg-surface rounded-t-xl px-5 pt-2.5 pb-7"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="w-9 h-1 rounded-[2px] bg-divider self-center mb-3" />

          <View className="flex-row items-center justify-between mb-3.5">
            <Text className="font-heading text-[17px] text-ink">Filtros</Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              className="w-[30px] h-[30px] rounded-sm items-center justify-center"
            >
              <XIcon size={16} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-3.5">
              <SegmentedControl
                options={TYPE_OPTIONS}
                value={filters.type}
                onChange={(type) => setFilter('type', type)}
              />

              <View className="flex-row flex-wrap gap-1.5">
                {categories.map((name) => (
                  <CategoryChip
                    key={name}
                    name={name}
                    selected={filters.categories.includes(name)}
                    onPress={() => toggleCategory(name)}
                  />
                ))}
              </View>

              <View className="flex-row flex-wrap gap-2.5">
                <View className="w-[47%]">
                  <DateField
                    label="De"
                    value={filters.from}
                    onChange={(value) => setFilter('from', value)}
                    placeholder="Qualquer"
                  />
                </View>
                <View className="w-[47%]">
                  <DateField
                    label="Até"
                    value={filters.to}
                    onChange={(value) => setFilter('to', value)}
                    placeholder="Qualquer"
                  />
                </View>
                <View className="w-[47%]">
                  <FormField label="Valor mín.">
                    <Input
                      placeholder="0"
                      keyboardType="decimal-pad"
                      value={filters.min}
                      onChangeText={(value) => setFilter('min', value)}
                    />
                  </FormField>
                </View>
                <View className="w-[47%]">
                  <FormField label="Valor máx.">
                    <Input
                      placeholder="0"
                      keyboardType="decimal-pad"
                      value={filters.max}
                      onChangeText={(value) => setFilter('max', value)}
                    />
                  </FormField>
                </View>
              </View>

              <View className="flex-row gap-2.5 mt-1">
                <Button variant="secondary" className="flex-1" onPress={clearFilters}>
                  Limpar
                </Button>
                <Button variant="primary" className="flex-1" onPress={onClose}>
                  Aplicar
                </Button>
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
