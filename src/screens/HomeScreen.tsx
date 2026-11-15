import { useCallback, useEffect } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { StackNavigationRoutes } from "@/src/routes/App.routes";

import { TransactionList } from "@/src/components/TransactionsList";
import { Button } from "@/src/components/Button";
import { BalanceCard } from "@/src/components/BalanceCard";
import { FilterSheet } from "@/src/components/FilterSheet";
import { FilterIcon } from "@/src/components/icons";

import { colors } from "@/src/theme/colors";
import { useAppContext } from "@/src/hooks/useAppContext";
import { ScreenTransition } from "@/src/components/ScreenTransition";

export default function HomeScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();

    const store = useAppContext();

    useFocusEffect(
        useCallback(() => {
            store.loadTransactions();
        }, [store.loadTransactions])
    );

    return (
        <ScreenTransition className="bg-[#111111]">
            <View className="p-6 flex-1 bg-[#111111]">
                <View className="flex-row items-center justify-between">
                    <Text className="text-[32px] font-bold text-[#F5F5F5]">
                        Olá
                        {store.user?.displayName
                            ? `, ${store.user.displayName.trim().split(" ")[0]}`
                            : ""}
                    </Text>

                    <View className="flex-row items-center gap-2.5">
                        <Pressable
                            className="w-9 h-9 rounded-md items-center justify-center bg-surface border border-divider"
                            onPress={ store.toggleFilters }
                        >
                            <FilterIcon size={ 17 } color={ colors.text } knobFill={ colors.surface }/>
                            { store.appliedFilterCount ? (
                                <View className="absolute -top-1.5 -right-1.5 min-w-4 h-4 rounded-[8px] bg-brand items-center justify-center px-[3px]">
                                    <Text className="text-white text-[10px] font-heading">{ store.appliedFilterCount }</Text>
                                </View>
                            ) : null }
                        </Pressable>

                        <Button
                            variant="primary"
                            onPress={ () =>
                                navigation.navigate("AddTransaction", { transaction: undefined })
                            }
                        >
                            + Nova
                        </Button>
                    </View>
                </View>

                <BalanceCard
                    balance={ store.balance }
                    totalIncome={ store.totalIncome }
                    totalExpense={ store.totalExpense }
                />

                <TransactionList
                    transactions={ store.filteredTransactions }
                    loadingMore={ store.loadingMore }
                    onLoadMore={ store.loadMoreTransactions }
                />

                <FilterSheet store={ store }/>
            </View>
        </ScreenTransition>
    );
}
