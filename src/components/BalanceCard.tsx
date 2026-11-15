import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';

import type { TransactionSummary } from '@/src/domain/transactions';
import { formatCurrency } from '@/src/utils/format';

const Gradient = styled(LinearGradient);

function BalanceStat({ label, value }: { label: string; value: number }) {
    return (
        <View className="flex-1 bg-[#1C1412] rounded-[26px] p-5 min-h-[110px]">
            <Text className="text-[15px] font-semibold tracking-[0.5px] text-[#A9A3A1]">{label}</Text>

            <Text
                className="mt-3.5 text-[21px] font-extrabold text-[#F5F5F5]"
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                {formatCurrency(value)}
            </Text>
        </View>
    );
}

export function BalanceCard({ balance, totalIncome, totalExpense }: TransactionSummary) {
    return (
        <Gradient
            colors={['#2A1B19', '#43231D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="mt-7 bg-[#321F1B] rounded-[36px] p-6"
        >
            <Text className="text-[17px] font-semibold tracking-[1.3px] text-[#A9A3A1]">
                SALDO DISPONÍVEL
            </Text>

            <Text className="mt-2.5 text-[42px] font-extrabold text-[#F5F5F5]">{formatCurrency(balance)}</Text>

            <View className="flex-row gap-3 mt-5">
                <BalanceStat label="↑ RECEITAS" value={totalIncome} />
                <BalanceStat label="↓ DESPESAS" value={totalExpense} />
            </View>
        </Gradient>
    );
}
