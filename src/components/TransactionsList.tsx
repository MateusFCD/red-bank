import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import type { Transaction } from "@/src/interfaces";
import { colors, textMuted } from "@/src/theme/colors";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { StackNavigationRoutes } from "@/src/routes/App.routes";

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

    const formatCurrency = (value: number) =>
        value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Transações recentes
            </Text>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        Nenhuma transação encontrada.
                    </Text>
                }
                ListFooterComponent={
                    loadingMore ? (
                        <ActivityIndicator style={styles.loading} />
                    ) : null
                }
                renderItem={({ item: transaction }) => (
                    <Pressable
                        style={styles.transactionItem}
                        onPress={() =>
                            navigation.navigate("TransactionDetails", {
                                transaction,
                            })
                        }
                    >
                        <View style={styles.transactionInfo}>
                            <Text style={styles.transactionDesc}>
                                {transaction.desc}
                            </Text>

                            <Text style={styles.transactionCategory}>
                                {transaction.category} · {transaction.date}
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.transactionAmount,
                                transaction.type === "income"
                                    ? styles.income
                                    : styles.expense,
                            ]}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 32,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 18,
    },

    transactionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: textMuted(0.12),
    },

    transactionInfo: {
        flex: 1,
        marginRight: 16,
    },

    transactionDesc: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },

    transactionCategory: {
        marginTop: 5,
        fontSize: 13,
        color: textMuted(0.65),
    },

    transactionAmount: {
        fontSize: 16,
        fontWeight: "700",
    },

    income: {
        color: "#7FCF9A",
    },

    expense: {
        color: colors.accent300,
    },

    emptyText: {
        fontSize: 14,
        color: textMuted(0.65),
    },

    loading: {
        marginVertical: 20,
    },
});