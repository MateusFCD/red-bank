import { Text, View } from 'react-native';

import type { CategorySummary } from '@/src/domain/dashboard';

type CategoryLegendItem = Pick<CategorySummary, 'name' | 'percentage' | 'color'>;

function CategoryLegendRow({ name, percentage, color }: CategoryLegendItem) {
    return (
        <View className="flex-row justify-between items-center mb-[9px]">
            <View className="flex-row items-center flex-1">
                <View
                    className="w-[7px] h-[7px] rounded-[4px] mr-[7px]"
                    style={{ backgroundColor: color }}
                />
                <Text className="text-[#D8D5D5] text-[10px] font-semibold">{name}</Text>
            </View>

            <Text className="text-[#F5F5F5] text-[10px] font-extrabold">{percentage}%</Text>
        </View>
    );
}

export function CategoryLegend({ items }: { items: CategoryLegendItem[] }) {
    return (
        <View className="flex-1 ml-2.5">
            {items.map((item) => (
                <CategoryLegendRow key={item.name} {...item} />
            ))}
        </View>
    );
}
