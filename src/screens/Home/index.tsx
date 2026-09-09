import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { StackNavigationRoutes } from "@/src/routes/App.routes";

import { TransactionList } from "@/src/components/TransactionsList";
import { Button } from "@/src/components/Button";
import { BalanceCard } from "@/src/components/BalanceCard";

import { getTransactions } from "@/src/services/transactions";

import type { Transaction } from "@/src/interfaces";

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadTransactions() {
        try {
          const data = await getTransactions();
          setTransactions(data);
        } catch (error) {
          console.log("🔥 erro on search transactions:", error);
        }
      }

      loadTransactions();
    }, [])
  );

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fluxo</Text>
        <View style={styles.headerActions}>
          <Button
            variant="secondary"
            onPress={() => { }}
          >
            ⚙
          </Button>
          <Button
            variant="primary"
            onPress={() => navigation.navigate("AddTransaction")}
          >
            + Nova
          </Button>
        </View>
      </View>
      <BalanceCard
        balance={balance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
      />
      <TransactionList transactions={transactions} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 24,
    paddingTop: 60,
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

});