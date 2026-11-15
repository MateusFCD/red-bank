import { Text, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";

const Gradient = styled(LinearGradient);

interface BalanceCardProps {
    balance: number;
    totalIncome: number;
    totalExpense: number;
}

export function BalanceCard({
    balance,
    totalIncome,
    totalExpense,
}: BalanceCardProps) {
    const formatCurrency = (value: number) =>
        value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

    return (
        <Gradient
            colors={["#2A1B19", "#43231D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="mt-7 bg-[#321F1B] rounded-[36px] p-6"
        >
            <Text className="text-[17px] font-semibold tracking-[1.3px] text-[#A9A3A1]">
                SALDO DISPONÍVEL
            </Text>

            <Text className="mt-2.5 text-[42px] font-extrabold text-[#F5F5F5]">
                {formatCurrency(balance)}
            </Text>

            <View className="flex-row gap-3 mt-5">
                <View className="flex-1 bg-[#1C1412] rounded-[26px] p-5 min-h-[110px]">
                    <Text className="text-[15px] font-semibold tracking-[0.5px] text-[#A9A3A1]">
                        ↑ RECEITAS
                    </Text>

                    <Text
                        className="mt-3.5 text-[21px] font-extrabold text-[#F5F5F5]"
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {formatCurrency(totalIncome)}
                    </Text>
                </View>

                <View className="flex-1 bg-[#1C1412] rounded-[26px] p-5 min-h-[110px]">
                    <Text className="text-[15px] font-semibold tracking-[0.5px] text-[#A9A3A1]">
                        ↓ DESPESAS
                    </Text>

                    <Text
                        className="mt-3.5 text-[21px] font-extrabold text-[#F5F5F5]"
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {formatCurrency(totalExpense)}
                    </Text>
                </View>
            </View>
        </Gradient>
    );
}
