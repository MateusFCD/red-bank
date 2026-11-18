import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface DashboardSectionProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export function DashboardSection({ title, subtitle, children }: DashboardSectionProps) {
    return (
        <View className="bg-[#1C1A1A] rounded-[20px] border border-[#2C2929] p-[17px] mb-3">
            <View className="mb-[18px]">
                <Text className="text-[#F5F5F5] text-[24px] font-extrabold">{title}</Text>
                <Text className="text-[#8C8989] text-[14px] mt-[3px]">{subtitle}</Text>
            </View>

            {children}
        </View>
    );
}
