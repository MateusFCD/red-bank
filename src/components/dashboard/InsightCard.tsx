import { Text, View } from 'react-native';

import { cn } from '@/src/utils/cn';

type InsightVariant = 'positive' | 'brand';

interface InsightCardProps {
    variant: InsightVariant;
    icon: string;
    title: string;
    description: string;
    highlight: string;
    className?: string;
}

const variantClasses: Record<
    InsightVariant,
    { card: string; iconBg: string; icon: string; highlightBg: string; highlight: string; description: string }
> = {
    positive: {
        card: 'bg-[#101A16] border-[#13a0653a]',
        iconBg: 'bg-[#123D2D]',
        icon: 'text-[#13A066] text-[16px] font-semibold leading-[32px]',
        highlightBg: 'bg-[#142A21] rounded-[8px] py-2.5 px-3',
        highlight: 'text-[#62C58C] text-[11px] font-semibold leading-[16px]',
        description: 'text-[#A8A8A8]',
    },
    brand: {
        card: 'bg-[#201817] border-[#4B2420]',
        iconBg: 'bg-[#3A211E]',
        icon: 'text-[#FF3B1F] text-[18px]',
        highlightBg: 'bg-[#2B1D1A] rounded-[10px] p-2.5',
        highlight: 'text-[#FFB2A5] text-[11px] font-bold',
        description: 'text-[#BEB8B7]',
    },
};

export function InsightCard({ variant, icon, title, description, highlight, className }: InsightCardProps) {
    const styles = variantClasses[variant];

    return (
        <View className={cn('flex-row border rounded-[20px] p-[17px] mb-3', styles.card, className)}>
            <View className={cn('w-[34px] h-[34px] rounded-[17px] justify-center items-center mr-3', styles.iconBg)}>
                <Text className={styles.icon}>{icon}</Text>
            </View>

            <View className="flex-1">
                <Text className="text-[#F5F5F5] text-[18px] font-extrabold mb-1.5">{title}</Text>
                <Text className={cn('text-[13px] leading-[18px] mb-3', styles.description)}>{description}</Text>

                <View className={styles.highlightBg}>
                    <Text className={styles.highlight}>{highlight}</Text>
                </View>
            </View>
        </View>
    );
}
