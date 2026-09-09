import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/src/theme/colors";

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
        <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>
                SALDO DISPONÍVEL
            </Text>

            <Text style={styles.balanceValue}>
                {formatCurrency(balance)}
            </Text>

            <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>
                        ↑ RECEITAS
                    </Text>

                    <Text style={styles.summaryValue}>
                        {formatCurrency(totalIncome)}
                    </Text>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>
                        ↓ DESPESAS
                    </Text>

                    <Text style={styles.summaryValue}>
                        {formatCurrency(totalExpense)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
});