import { useAppContext } from "@/src/hooks/useAppContext";
import { useState } from "react";
import { cn } from "@/src/utils/cn";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const { width } = Dimensions.get("window");

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
    <View className="justify-center items-center">
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

      <View className="absolute items-center">
        <Text className="text-[#8C8989] text-[8px] font-bold tracking-[1px]">TOTAL</Text>
        <Text className="text-[#F5F5F5] text-[12px] font-extrabold mt-0.5">R${formatCurrency(Number(totalGastos.toFixed(2)))}</Text>
      </View>
    </View>
  );
}

function FinancialChart({ data }: { data: FinancialSummaryItem[] }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View className="w-full">
      {data.map((item) => {
        const percentage = item.value < 0 ? 0 : item.value / maxValue;

        return (
          <View key={item.label} className="mb-[17px]">
            <View className="flex-row justify-between items-center mb-[7px]">
              <Text className="text-[#D8D5D5] text-[11px] font-bold">{item.label}</Text>
              <Text className="text-[11px] font-extrabold" style={{ color: item.color }}>
                {formatCurrency(item.value)}
              </Text>
            </View>

            <View className="w-full h-2.5 bg-[#302D2D] rounded-[10px] overflow-hidden">
              <View
                className="h-full rounded-[10px]"
                // Largura e cor dependem dos dados do mês.
                style={{
                  width: `${percentage * 100}%`,
                  backgroundColor: item.color,
                }}
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
    <View className="flex-row justify-between items-center mb-[9px]">
      <View className="flex-row items-center flex-1">
        <View
          className="w-[7px] h-[7px] rounded-[4px] mr-[7px]"
          style={{ backgroundColor: color }}
        />

        <Text className="text-[#D8D5D5] text-[10px] font-semibold">{name}</Text>
      </View>

      <Text className="text-[#F5F5F5] text-[10px] font-extrabold">{percentage}%</Text>
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
    <View className="flex-1 bg-[#121212]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-6 pt-7"
      >
        <View className="w-full items-end mb-[15px]">
          <Pressable
            className="flex-row items-center bg-[#242121] px-2.5 py-1.5 rounded-[8px] self-end"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-[#D8D5D5] text-[18px] font-bold">{currentMonthLabel}</Text>
            <Text className="text-[#FF3B1F] text-[18px] ml-1">⌄</Text>
          </Pressable>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <Pressable
              className="flex-1 bg-[rgba(0,0,0,0.4)] justify-center items-center"
              onPress={() => setModalVisible(false)}
            >
              <View className="w-4/5 max-h-[50%] bg-app rounded-[12px] py-2 shadow-modal">
                <FlatList
                  data={monthsList}
                  keyExtractor={(item) => String(item.value)}
                  renderItem={({ item }) => (
                    <Pressable
                      className={cn(
                        "py-3.5 px-5",
                        item.value === selectedMonth && "bg-app",
                      )}
                      onPress={() => {
                        setSelectedMonth(item.value);
                        setModalVisible(false);
                      }}
                    >
                      <Text
                        className={cn(
                          "text-[18px]",
                          item.value === selectedMonth
                            ? "font-bold text-[#FF3B1F]"
                            : "text-white",
                        )}
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

        <View className="bg-[#1C1A1A] rounded-[20px] border border-[#2C2929] p-[17px] mb-3">
          <View className="flex-row items-center justify-between mb-[18px]">
            <View>
              <Text className="text-[#F5F5F5] text-[24px] font-extrabold">Gastos por categoria</Text>
              <Text className="text-[#8C8989] text-[14px] mt-[3px]">
                Distribuição das suas despesas
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <DonutChart categories={categories} totalGastos={totalGastos} />

            <View className="flex-1 ml-2.5">
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

        <View className="bg-[#1C1A1A] rounded-[20px] border border-[#2C2929] p-[17px] mb-3">
          <View className="flex-row items-center justify-between mb-[18px]">
            <View>
              <Text className="text-[#F5F5F5] text-[24px] font-extrabold">Resumo financeiro</Text>
              <Text className="text-[#8C8989] text-[14px] mt-[3px]">
                Entradas, gastos e saldo do mês
              </Text>
            </View>
          </View>

          <FinancialChart data={data} />
        </View>

        <View className="flex-row bg-[#101A16] border-[#13a0653a] border rounded-[20px] p-[17px] mb-3">
          <View className="bg-[#123D2D] w-[34px] h-[34px] rounded-[17px] justify-center items-center mr-3">
            <Text className="text-[#13A066] text-[16px] font-semibold leading-[32px]">$</Text>
          </View>

          <View className="flex-1">
            <Text className="text-[#FFFFFF] text-[18px] font-bold mb-[5px]">Receitas do mês</Text>
            <Text className="text-[#A8A8A8] text-[13px] leading-[18px] mb-3">
              Entradas de dinheiro recebidas neste mês.
            </Text>

            <View className="bg-[#142A21] rounded-[8px] py-2.5 px-3">
              <Text className="text-[#62C58C] text-[11px] font-semibold leading-[16px]">
                Você recebeu R${formatCurrency(Number(totalEntradas.toFixed(2)))} este mês.
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row bg-[#201817] border border-[#4B2420] rounded-[20px] p-[17px] mb-5">
          <View className="w-[34px] h-[34px] rounded-[17px] bg-[#3A211E] justify-center items-center mr-3">
            <Text className="text-[#FF3B1F] text-[18px]">✦</Text>
          </View>

          <View className="flex-1">
            <Text className="text-[#F5F5F5] text-[18px] font-extrabold mb-1.5">Análise financeira</Text>
            <Text className="text-[#BEB8B7] text-[13px] leading-[18px]">{getAnalysisMessage(saldo)}</Text>

            <View className="mt-3 bg-[#2B1D1A] rounded-[10px] p-2.5">
              <Text className="text-[#FFB2A5] text-[11px] font-bold">
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
