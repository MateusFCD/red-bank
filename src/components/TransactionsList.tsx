import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";

import type { Transaction } from "@/src/interfaces";
import { cn } from "@/src/utils/cn";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { StackNavigationRoutes } from "@/src/routes/App.routes";
import { formatCurrency, formatDateDisplay } from "../utils/format";

interface TransactionListProps {
    transactions: Transaction[];
    loadingMore: boolean;
    onLoadMore: () => void;
}

export function TransactionList({
    transactions,
    loadingMore,
    onLoadMore,
}: TransactionListProps) {

    const navigation =
        useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();

    return (
        <View className="flex-1 mt-8">
            <Text className="text-[22px] font-bold text-ink mb-[18px]">
                Transações recentes
            </Text>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    <Text className="text-[14px] text-ink/65">
                        Nenhuma transação encontrada.
                    </Text>
                }
                ListFooterComponent={
                    loadingMore ? (
                        <ActivityIndicator className="my-5" />
                    ) : null
                }
                renderItem={({ item: transaction }) => (
                    <Pressable
                        className="flex-row items-center justify-between py-[18px] border-b border-b-ink/12"
                        onPress={() =>
                            navigation.navigate("TransactionDetails", {
                                transaction,
                            })
                        }
                    >
                        <View className="flex-1 mr-4">
                            <Text className="text-[16px] font-semibold text-ink">
                                {transaction.desc}
                            </Text>

                            <Text className="mt-[5px] text-[13px] text-ink/65">
                                {transaction.category} · {formatDateDisplay(transaction.date)}
                            </Text>
                        </View>

                        <Text
                            className={cn(
                                "text-[16px] font-bold",
                                transaction.type === "income"
                                    ? "text-[#7FCF9A]"
                                    : "text-brand-300",
                            )}
                        >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                        </Text>
                    </Pressable>
                )}
            />
        </View>
    );
}
