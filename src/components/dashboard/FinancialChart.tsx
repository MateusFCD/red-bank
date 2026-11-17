import { Text, View } from 'react-native';

import type { FinancialSummaryItem } from '@/src/domain/dashboard';
import { formatCurrency } from '@/src/utils/format';

export function FinancialChart({ data }: { data: FinancialSummaryItem[] }) {
    const maxValue = Math.max(...data.map((item) => item.value), 1);

    return (
        <View className="w-full">
            {data.map((item) => {
                const ratio = item.value < 0 ? 0 : item.value / maxValue;

                return (
                    <View key={item.label} className="mb-[17px]">
                        <View className="flex-row justify-between items-center mb-[7px]">
                            <Text className="text-[#D8D5D5] text-[11px] font-bold">{item.label}</Text>
                            <Text className="text-[11px] font-extrabold" style={{ color: item.color }}>
                                {formatCurrency(item.value)}
                            </Text>
                        </View>

                        <View className="w-full h-2.5 bg-[#302D2D] rounded-[10px] overflow-hidden">
                            <View
                                className="h-full rounded-[10px]"
                                // Largura e cor dependem dos dados do mês.
                                style={{ width: `${ratio * 100}%`, backgroundColor: item.color }}
                            />
                        </View>
                    </View>
                );
            })}
        </View>
    );
}
