import { Text, View } from 'react-native';

import type { Transaction } from '@/src/interfaces';
import { cn } from '@/src/utils/cn';
import { formatCurrency } from '@/src/utils/format';

type TransactionSummaryCardProps = Pick<Transaction, 'category' | 'amount' | 'type' | 'desc'>;

export function TransactionSummaryCard({ category, amount, type, desc }: TransactionSummaryCardProps) {
    const isIncome = type === 'income';

    return (
        <View className="bg-[#1C1A19] rounded-[28px] p-6 h-[185px]">
            <View className="self-start border-[1.5px] border-[#FF321E] rounded-[20px] px-4 py-1.5">
                <Text className="text-[15px] font-medium text-[#FF321E]">{category}</Text>
            </View>

            <Text
                className={cn(
                    'mt-[26px] text-[32px] font-extrabold',
                    isIncome ? 'text-[#65D39A]' : 'text-[#F5F5F5]',
                )}
            >
                {isIncome ? '+' : '-'} {formatCurrency(amount)}
            </Text>

            <Text className="mt-3.5 text-[17px] font-medium text-[#96918F]">{desc}</Text>
        </View>
    );
}
