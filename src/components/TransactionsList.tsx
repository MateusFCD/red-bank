import { StyleSheet, Text, View } from "react-native";

import type { Transaction } from "@/src/interfaces";
import { colors, textMuted } from "@/src/theme/colors";

interface TransactionListProps {
    transactions: Transaction[];
}

export function TransactionList({
    transactions,
}: TransactionListProps) {
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

            {transactions.length === 0 ? (
                <Text style={styles.emptyText}>
                    Nenhuma transação encontrada.
                </Text>
            ) : (
                transactions.map((transaction) => (
                    <View
                        key={transaction.id}
                        style={styles.transactionItem}
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
                    </View>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
});