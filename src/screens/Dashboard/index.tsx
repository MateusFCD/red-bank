import { useAppContext } from "@/src/hooks/useAppContext";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const { width } = Dimensions.get("window");

const COLORS = {
  background: "#121212",
  card: "#1C1A1A",
  cardLight: "#242121",
  orange: "#FF3B1F",
  orangeSoft: "#FF684F",
  white: "#F5F5F5",
  text: "#D8D5D5",
  muted: "#8C8989",
  border: "#2C2929",
  green: "#45D483",
};

type TransactionType = "income" | "expense";

interface Transaction {
  id: string;
  desc: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  receipt?: string | null;
}

interface CategorySummary {
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

interface FinancialSummaryItem {
  label: string;
  value: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "#F2EEEE",
  Transporte: "#FF3B1F",
  Moradia: "#D4D0D0",
  Saúde: "#FF9482",
  Lazer: "#E52F19",
  Compras: "#F4C1B8",
  Educação: "#9E9A9A",
  Salário: "#B8B4B4",
  Outros: "#c0210f",
};

function filterTransactionsByMonth(
  transactions: Transaction[],
  year: number,
  month: number,
): Transaction[] {
  const monthStr = String(month).padStart(2, "0");
  const targetPrefix = `${year}-${monthStr}`;
  return transactions.filter((t) => t.date.startsWith(targetPrefix));
}

function getCategoriesData(
  filteredTransactions: Transaction[],
): CategorySummary[] {
  const expenses = filteredTransactions.filter((t) => t.type === "expense");
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  return Object.keys(categoryMap).map((name) => {
    const amount = categoryMap[name];
    const percentage =
      totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;

    return {
      name,
      percentage,
      amount: Number(amount.toFixed(2)),
      color: CATEGORY_COLORS[name] || "#CCCCCC",
    };
  });
}

function getFinancialOverviewData(
  totalEntradas: number,
  totalGastos: number,
  saldo: number,
): FinancialSummaryItem[] {
  const saldoColor = saldo < 0 ? "#FF3B1F" : "#7edfaa";
  return [
    {
      label: "Entradas",
      value: Number(totalEntradas.toFixed(2)),
      color: "#22c55e",
    },
    {
      label: "Gastos",
      value: Number(totalGastos.toFixed(2)),
      color: "#f97316",
    },
    {
      label: "Saldo",
      value: Number(saldo.toFixed(2)),
      color: saldoColor,
    },
  ];
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function DonutChart({
  categories,
  totalGastos,
}: {
  categories: CategorySummary[];
  totalGastos: number;
}) {
  const size = Math.min(width * 0.52, 205);
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <View style={styles.chartContainer}>
      <Svg width={size} height={size}>
        <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#292626"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {categories.map((category) => {
            const segment = (category.percentage / 100) * circumference;
            const currentOffset = offset;
            offset += segment;

            return (
              <Circle
                key={category.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={category.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${segment} ${circumference - segment}`}
                strokeDashoffset={-currentOffset}
              />
            );
          })}
        </G>
      </Svg>

      <View style={styles.chartCenter}>
        <Text style={styles.chartLabel}>TOTAL</Text>
        <Text style={styles.chartValue}>R${formatCurrency(Number(totalGastos.toFixed(2)))}</Text>
      </View>
    </View>
  );
}

function FinancialChart({ data }: { data: FinancialSummaryItem[] }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={styles.financialChart}>
      {data.map((item) => {
        const percentage = item.value < 0 ? 0 : item.value / maxValue;

        return (
          <View key={item.label} style={styles.financialRow}>
            <View style={styles.financialHeader}>
              <Text style={styles.financialLabel}>{item.label}</Text>
              <Text style={[styles.financialValue, { color: item.color }]}>
                {formatCurrency(item.value)}
              </Text>
            </View>

            <View style={styles.barBackground}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${percentage * 100}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

function CategoryRow({
  name,
  percentage,
  color,
}: {
  name: string;
  percentage: number;
  color: string;
}) {
  return (
    <View style={styles.categoryRow}>
      <View style={styles.categoryName}>
        <View
          style={[
            styles.categoryDot,
            {
              backgroundColor: color,
            },
          ]}
        />

        <Text style={styles.categoryText}>{name}</Text>
      </View>

      <Text style={styles.categoryPercentage}>{percentage}%</Text>
    </View>
  );
}

const getAnalysisMessage = (saldo: number) => {
  if (saldo > 200) {
    return "Seus gastos estão sob controle e você conseguiu uma excelente margem de sobra neste mês. Continue assim!";
  } else if (saldo >= 0 && saldo <= 200) {
    return "Você fechou o mês no azul, mas com uma margem bem justa. Vale a pena ficar de olho nos próximos gastos.";
  } else {
    return "Atenção: seus gastos superaram suas entradas neste mês e você ficou no vermelho. Reveja o orçamento para recuperar o saldo.";
  }
};

export default function HomeScreen() {
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [modalVisible, setModalVisible] = useState(false);
  const ano = 2026;
  const store = useAppContext();

  const transacoesDoMes = filterTransactionsByMonth(
    store.transactions,
    ano,
    selectedMonth,
  );

  const totalEntradas = transacoesDoMes
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalGastos = transacoesDoMes
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const saldo = totalEntradas - totalGastos;

  const categories = getCategoriesData(transacoesDoMes);
  const data = getFinancialOverviewData(totalEntradas, totalGastos, saldo);

  const monthsList = [
    { label: "Janeiro", value: 1 },
    { label: "Fevereiro", value: 2 },
    { label: "Março", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Maio", value: 5 },
    { label: "Junho", value: 6 },
    { label: "Julho", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Setembro", value: 9 },
    { label: "Outubro", value: 10 },
    { label: "Novembro", value: 11 },
    { label: "Dezembro", value: 12 },
  ];

  const currentMonthLabel =
    monthsList.find((m) => m.value === selectedMonth)?.label || "Selecione";

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topBar}>
          <Pressable
            style={styles.monthSelector}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.monthText}>{currentMonthLabel}</Text>
            <Text style={styles.chevron}>⌄</Text>
          </Pressable>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <FlatList
                  data={monthsList}
                  keyExtractor={(item) => String(item.value)}
                  renderItem={({ item }) => (
                    <Pressable
                      style={[
                        styles.modalItem,
                        item.value === selectedMonth &&
                          styles.modalItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedMonth(item.value);
                        setModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalItemText,
                          item.value === selectedMonth &&
                            styles.modalItemTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
            </Pressable>
          </Modal>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Gastos por categoria</Text>
              <Text style={styles.sectionSubtitle}>
                Distribuição das suas despesas
              </Text>
            </View>
          </View>

          <View style={styles.chartArea}>
            <DonutChart categories={categories} totalGastos={totalGastos} />

            <View style={styles.legend}>
              {categories.map((category) => (
                <CategoryRow
                  key={category.name}
                  name={category.name}
                  percentage={category.percentage}
                  color={category.color}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Resumo financeiro</Text>
              <Text style={styles.sectionSubtitle}>
                Entradas, gastos e saldo do mês
              </Text>
            </View>
          </View>

          <FinancialChart data={data} />
        </View>

        <View style={styles.incomeCard}>
          <View style={styles.incomeIcon}>
            <Text style={styles.incomeIconText}>$</Text>
          </View>

          <View style={styles.incomeContent}>
            <Text style={styles.incomeTitle}>Receitas do mês</Text>
            <Text style={styles.incomeText}>
              Entradas de dinheiro recebidas neste mês.
            </Text>

            <View style={styles.incomeHighlight}>
              <Text style={styles.incomeHighlightText}>
                Você recebeu R${formatCurrency(Number(totalEntradas.toFixed(2)))} este mês.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.analysisCard}>
          <View style={styles.analysisIcon}>
            <Text style={styles.analysisIconText}>✦</Text>
          </View>

          <View style={styles.analysisContent}>
            <Text style={styles.analysisTitle}>Análise financeira</Text>
            <Text style={styles.analysisText}>{getAnalysisMessage(saldo)}</Text>

            <View style={styles.analysisHighlight}>
              <Text style={styles.analysisHighlightText}>
                {saldo >= 0
                  ? `Você economizou R$${formatCurrency(Number(saldo.toFixed(2)))} este mês.`
                  : `Você fechou o mês com um déficit de R$${formatCurrency(Number(Math.abs(saldo).toFixed(2)))}.`}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  eyebrow: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 5,
  },

  title: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: "800",
  },

  avatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: COLORS.orange,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "800",
  },

  balanceCard: {
    backgroundColor: COLORS.orange,
    borderRadius: 22,
    padding: 20,
    marginBottom: 12,
  },

  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  balanceLabel: {
    color: "#FFE4DF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.14)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#B9FFD7",
    marginRight: 5,
  },

  statusText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "600",
  },

  balance: {
    color: "#FFF",
    fontSize: 31,
    fontWeight: "800",
    marginTop: 9,
    marginBottom: 22,
  },

  balanceFooter: {
    flexDirection: "row",
    gap: 45,
  },

  balanceSmallLabel: {
    color: "#FFD8D0",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 3,
  },

  balanceIncome: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },

  balanceExpense: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },

  metrics: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  metricCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
  },

  metricTitle: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 8,
  },

  metricValue: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
  },

  greenText: {
    color: COLORS.green,
  },

  orangeText: {
    color: COLORS.orange,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 17,
    marginBottom: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 3,
  },

  topBar: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 15,
  },

  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-end",
  },

  monthText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "700",
  },

  chevron: {
    color: COLORS.orange,
    fontSize: 13,
    marginLeft: 4,
  },

  chartArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  chartCenter: {
    position: "absolute",
    alignItems: "center",
  },

  chartLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
  },

  chartValue: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },

  legend: {
    flex: 1,
    marginLeft: 10,
  },

  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 9,
  },

  categoryName: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  categoryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  categoryText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "600",
  },

  categoryPercentage: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "800",
  },

  analysisCard: {
    flexDirection: "row",
    backgroundColor: "#201817",
    borderWidth: 1,
    borderColor: "#4B2420",
    borderRadius: 20,
    padding: 17,
    marginBottom: 20,
  },

  analysisIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#3A211E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  analysisIconText: {
    color: COLORS.orange,
    fontSize: 18,
  },

  analysisContent: {
    flex: 1,
  },

  analysisTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },

  analysisText: {
    color: "#BEB8B7",
    fontSize: 13,
    lineHeight: 18,
  },

  analysisHighlight: {
    marginTop: 12,
    backgroundColor: "#2B1D1A",
    borderRadius: 10,
    padding: 10,
  },

  analysisHighlightText: {
    color: "#FFB2A5",
    fontSize: 11,
    fontWeight: "700",
  },

  seeAll: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: "800",
  },

  transactions: {
    marginTop: -2,
  },

  transaction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  transactionIcon: {
    width: 37,
    height: 37,
    borderRadius: 13,
    backgroundColor: COLORS.cardLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  transactionIconText: {
    color: COLORS.orange,
    fontSize: 17,
    fontWeight: "800",
  },

  transactionInfo: {
    flex: 1,
  },

  transactionTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  transactionCategory: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
  },

  transactionAmount: {
    color: "#FF8270",
    fontSize: 12,
    fontWeight: "800",
  },

  footer: {
    color: "#555151",
    textAlign: "center",
    fontSize: 9,
    marginTop: 6,
  },

  incomeCard: {
    flexDirection: "row",
    backgroundColor: "#101A16",
    borderColor: "#13a0653a",
    borderWidth: 1,
    borderRadius: 20,
    padding: 17,
    marginBottom: 12,
  },

  incomeIcon: {
    backgroundColor: "#123D2D",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  incomeIconText: {
    color: "#13A066",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 32,
  },

  incomeContent: {
    flex: 1,
  },

  incomeTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },

  incomeText: {
    color: "#A8A8A8",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },

  incomeHighlight: {
    backgroundColor: "#142A21",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  incomeHighlightText: {
    color: "#62C58C",
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
  },

  financialChart: {
    width: "100%",
  },

  financialRow: {
    marginBottom: 17,
  },

  financialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
  },

  financialLabel: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "700",
  },

  financialValue: {
    fontSize: 11,
    fontWeight: "800",
  },

  barBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#302D2D",
    borderRadius: 10,
    overflow: "hidden",
  },

  bar: {
    height: "100%",
    borderRadius: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "50%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  modalItemSelected: {
    backgroundColor: "#F0F0F0",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  modalItemTextSelected: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});
