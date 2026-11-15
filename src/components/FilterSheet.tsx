import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/src/components/Button';
import { DateField } from '@/src/components/DateField';
import { FormField } from '@/src/components/FormField';
import { Input } from '@/src/components/Input';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { XIcon } from '@/src/components/icons';
import type { AppContextValue } from '@/src/context/AppContext';
import { catColor } from '@/src/data/categories';
import { colors } from '@/src/theme/colors';
import { cn } from '@/src/utils/cn';

export function FilterSheet({ store }: { store: AppContextValue }) {
  return (
    <Modal
      visible={store.filtersOpen}
      transparent
      animationType="slide"
      onRequestClose={store.toggleFilters}
    >
      <Pressable className="flex-1 justify-end bg-[rgba(0,0,0,0.55)]" onPress={store.toggleFilters}>
        <Pressable
          className="max-h-[86%] bg-surface rounded-t-xl px-5 pt-2.5 pb-7"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="w-9 h-1 rounded-[2px] bg-divider self-center mb-3" />

          <View className="flex-row items-center justify-between mb-3.5">
            <Text className="font-heading text-[17px] text-ink">Filtros</Text>
            <Pressable
              onPress={store.toggleFilters}
              hitSlop={8}
              className="w-[30px] h-[30px] rounded-sm items-center justify-center"
            >
              <XIcon size={16} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-3.5">
              <SegmentedControl
                options={[
                  { value: 'all', label: 'Todas' },
                  { value: 'income', label: 'Receitas' },
                  { value: 'expense', label: 'Despesas' },
                ]}
                value={store.filterType}
                onChange={store.setFilterType}
              />

              <View className="flex-row flex-wrap gap-1.5">
                {store.distinctCategories.map((name) => {
                  const selected = store.filterCategories.includes(name);
                  const color = catColor(name);
                  return (
                    <Pressable
                      key={name}
                      onPress={() => store.toggleCategoryFilter(name)}
                      className={cn(
                        'rounded-pill border py-[3px] px-2.5',
                        !selected && 'bg-transparent border-divider',
                      )}
                      // Cor da categoria é calculada em runtime.
                      style={selected ? { backgroundColor: color, borderColor: color } : undefined}
                    >
                      <Text
                        className={cn(
                          'text-[11px]',
                          selected ? 'text-app font-body-medium' : 'text-ink font-body',
                        )}
                      >
                        {name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View className="flex-row flex-wrap gap-2.5">
                <View className="w-[47%]">
                  <DateField label="De" value={store.filterFrom} onChange={store.setFilterFrom} placeholder="Qualquer" />
                </View>
                <View className="w-[47%]">
                  <DateField label="Até" value={store.filterTo} onChange={store.setFilterTo} placeholder="Qualquer" />
                </View>
                <View className="w-[47%]">
                  <FormField label="Valor mín.">
                    <Input
                      placeholder="0"
                      keyboardType="decimal-pad"
                      value={store.filterMin}
                      onChangeText={store.setFilterMin}
                    />
                  </FormField>
                </View>
                <View className="w-[47%]">
                  <FormField label="Valor máx.">
                    <Input
                      placeholder="0"
                      keyboardType="decimal-pad"
                      value={store.filterMax}
                      onChangeText={store.setFilterMax}
                    />
                  </FormField>
                </View>
              </View>

              <View className="flex-row gap-2.5 mt-1">
                <Button variant="secondary" className="flex-1" onPress={store.clearFilters}>
                  Limpar
                </Button>
                <Button variant="primary" className="flex-1" onPress={store.toggleFilters}>
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
