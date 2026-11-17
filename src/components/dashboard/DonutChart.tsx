import { Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import type { CategorySummary } from '@/src/domain/dashboard';
import { formatCurrency } from '@/src/utils/format';

interface DonutChartProps {
    categories: CategorySummary[];
    total: number;
}

const STROKE_WIDTH = 22;

export function DonutChart({ categories, total }: DonutChartProps) {
    const { width } = useWindowDimensions();
    const size = Math.min(width * 0.52, 205);
    const radius = (size - STROKE_WIDTH) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    let offset = 0;

    return (
        <View className="justify-center items-center">
            <Svg width={size} height={size}>
                <G transform={`rotate(-90 ${center} ${center})`}>
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="#292626"
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                    />

                    {categories.map((category) => {
                        const segment = (category.percentage / 100) * circumference;
                        const currentOffset = offset;
                        offset += segment;

                        return (
                            <Circle
                                key={category.name}
                                cx={center}
                                cy={center}
                                r={radius}
                                stroke={category.color}
                                strokeWidth={STROKE_WIDTH}
                                fill="none"
                                strokeDasharray={`${segment} ${circumference - segment}`}
                                strokeDashoffset={-currentOffset}
                            />
                        );
                    })}
                </G>
            </Svg>

            <View className="absolute items-center">
                <Text className="text-[#8C8989] text-[8px] font-bold tracking-[1px]">TOTAL</Text>
                <Text className="text-[#F5F5F5] text-[12px] font-extrabold mt-0.5">
                    {formatCurrency(total)}
                </Text>
            </View>
        </View>
    );
}
