import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/components/Button';
import { DateField } from '@/src/components/DateField';
import { FormField } from '@/src/components/FormField';
import { Input } from '@/src/components/Input';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { XIcon } from '@/src/components/icons';
import type { AppContextValue } from '@/src/context/AppContext';
import { catColor } from '@/src/data/categories';
import { colors, fonts, radius } from '@/src/theme/colors';

export function FilterSheet({ store }: { store: AppContextValue }) {
  return (
    <Modal
      visible={store.filtersOpen}
      transparent
      animationType="slide"
      onRequestClose={store.toggleFilters}
    >
      <Pressable style={styles.backdrop} onPress={store.toggleFilters}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.grabber} />

          <View style={styles.header}>
            <Text style={styles.title}>Filtros</Text>
            <Pressable onPress={store.toggleFilters} hitSlop={8} style={styles.closeBtn}>
              <XIcon size={16} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.sections}>
              <SegmentedControl
                options={[
                  { value: 'all', label: 'Todas' },
                  { value: 'income', label: 'Receitas' },
                  { value: 'expense', label: 'Despesas' },
                ]}
                value={store.filterType}
                onChange={store.setFilterType}
              />

              <View style={styles.chips}>
                {store.distinctCategories.map((name) => {
                  const selected = store.filterCategories.includes(name);
                  const color = catColor(name);
                  return (
                    <Pressable
                      key={name}
                      onPress={() => store.toggleCategoryFilter(name)}
                      style={[
                        styles.chip,
                        selected ? { backgroundColor: color, borderColor: color } : styles.chipUnselected,
                      ]}
                    >
                      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{name}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.grid}>
                <View style={styles.gridCell}>
                  <DateField label="De" value={store.filterFrom} onChange={store.setFilterFrom} placeholder="Qualquer" />
                </View>
                <View style={styles.gridCell}>
                  <DateField label="Até" value={store.filterTo} onChange={store.setFilterTo} placeholder="Qualquer" />
                </View>
                <View style={styles.gridCell}>
                  <FormField label="Valor mín.">
                    <Input
                      placeholder="0"
                      keyboardType="decimal-pad"
                      value={store.filterMin}
                      onChangeText={store.setFilterMin}
                    />
                  </FormField>
                </View>
                <View style={styles.gridCell}>
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

              <View style={styles.actions}>
                <Button variant="secondary" style={styles.flex1} onPress={store.clearFilters}>
                  Limpar
                </Button>
                <Button variant="primary" style={styles.flex1} onPress={store.toggleFilters}>
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

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    maxHeight: '86%',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sections: { gap: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  chipUnselected: { backgroundColor: 'transparent', borderColor: colors.divider },
  chipLabel: { fontSize: 11, color: colors.text, fontFamily: fonts.body },
  chipLabelSelected: { color: colors.bg, fontFamily: fonts.bodyMedium },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCell: { width: '47%' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  flex1: { flex: 1 },
});
