import { StyleSheet, Text, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

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
        <LinearGradient
            colors={["#2A1B19", "#43231D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
        >
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

                    <Text
                        style={styles.summaryValue}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {formatCurrency(totalIncome)}
                    </Text>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>
                        ↓ DESPESAS
                    </Text>

                    <Text
                        style={styles.summaryValue}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {formatCurrency(totalExpense)}
                    </Text>
                </View>
            </View>
        </LinearGradient>
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
        fontSize: 17,
        fontWeight: "600",
        letterSpacing: 1.3,
        color: "#A9A3A1",
    },

    balanceValue: {
        marginTop: 10,
        fontSize: 42,
        fontWeight: "800",
        color: "#F5F5F5",
    },

    summaryRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
    },

    summaryCard: {
        flex: 1,
        backgroundColor: "#1C1412",
        borderRadius: 26,
        padding: 20,
        minHeight: 110,
    },

    summaryLabel: {
        fontSize: 15,
        fontWeight: "600",
        letterSpacing: 0.5,
        color: "#A9A3A1",
    },

    summaryValue: {
        marginTop: 14,
        fontSize: 21,
        fontWeight: "800",
        color: "#F5F5F5",
    },
});