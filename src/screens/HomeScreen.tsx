import { useCallback, useEffect } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { StackNavigationRoutes } from "@/src/routes/App.routes";

import { TransactionList } from "@/src/components/TransactionsList";
import { Button } from "@/src/components/Button";
import { BalanceCard } from "@/src/components/BalanceCard";
import { FilterSheet } from "@/src/components/FilterSheet";
import { FilterIcon } from "@/src/components/icons";

import { colors, fonts, radius } from "@/src/theme/colors";
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
        <ScreenTransition style={ { backgroundColor: "#111111" } }>
            <View style={ styles.container }>
                <View style={ styles.header }>
                    <Text style={styles.title}>
                        Olá
                        {store.user?.displayName
                            ? `, ${store.user.displayName.trim().split(" ")[0]}`
                            : ""}
                    </Text>

                    <View style={ styles.headerActions }>
                        <Pressable style={ styles.filterBtn } onPress={ store.toggleFilters }>
                            <FilterIcon size={ 17 } color={ colors.text } knobFill={ colors.surface }/>
                            { store.appliedFilterCount ? (
                                <View style={ styles.badge }>
                                    <Text style={ styles.badgeText }>{ store.appliedFilterCount }</Text>
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

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        backgroundColor: "#111111",
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#F5F5F5",
    },

    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    balanceCard: {
        marginTop: 28,
        backgroundColor: "#321F1B",
        borderRadius: 36,
        padding: 24,
    },

    balanceLabel: {
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: 1.5,
        color: "#A9A3A1",
    },

    balanceValue: {
        marginTop: 28,
        fontSize: 44,
        fontWeight: "800",
        color: "#F5F5F5",
    },

    summaryRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 22,
    },

    summaryCard: {
        flex: 1,
        backgroundColor: "#1C1412",
        borderRadius: 28,
        padding: 12,
    },

    summaryLabel: {
        fontSize: 17,
        fontWeight: "600",
        letterSpacing: 1,
        color: "#A9A3A1",
    },

    summaryValue: {
        marginTop: 18,
        fontSize: 18,
        fontWeight: "800",
        color: "#F5F5F5",
    },

    filterBtn: {
        width: 36,
        height: 36,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.divider,
    },

    badge: {
        position: 'absolute',
        top: -6,
        right: -6,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },

    badgeText: { color: '#fff', fontSize: 10, fontFamily: fonts.heading },

});
