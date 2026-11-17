import { ScrollView, View } from 'react-native';

import { CategoryLegend } from '@/src/components/dashboard/CategoryLegend';
import { DashboardSection } from '@/src/components/dashboard/DashboardSection';
import { DonutChart } from '@/src/components/dashboard/DonutChart';
import { FinancialChart } from '@/src/components/dashboard/FinancialChart';
import { InsightCard } from '@/src/components/dashboard/InsightCard';
import { MonthPicker } from '@/src/components/dashboard/MonthPicker';
import { getAnalysisMessage } from '@/src/domain/dashboard';
import { useMonthlyReport } from '@/src/hooks/useMonthlyReport';
import { formatCurrency } from '@/src/utils/format';

export default function DashboardScreen() {
    const { month, setMonth, summary, categories, overview } = useMonthlyReport();
    const { totalIncome, totalExpense, balance } = summary;

    const balanceHighlight =
        balance >= 0
            ? `Você economizou ${formatCurrency(balance)} este mês.`
            : `Você fechou o mês com um déficit de ${formatCurrency(Math.abs(balance))}.`;

    return (
        <View className="flex-1 bg-[#121212]">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-6 pt-7">
                <MonthPicker value={month} onChange={setMonth} />

                <DashboardSection title="Gastos por categoria" subtitle="Distribuição das suas despesas">
                    <View className="flex-row items-center">
                        <DonutChart categories={categories} total={totalExpense} />
                        <CategoryLegend items={categories} />
                    </View>
                </DashboardSection>

                <DashboardSection title="Resumo financeiro" subtitle="Entradas, gastos e saldo do mês">
                    <FinancialChart data={overview} />
                </DashboardSection>

                <InsightCard
                    variant="positive"
                    icon="$"
                    title="Receitas do mês"
                    description="Entradas de dinheiro recebidas neste mês."
                    highlight={`Você recebeu ${formatCurrency(totalIncome)} este mês.`}
                />

                <InsightCard
                    variant="brand"
                    icon="✦"
                    title="Análise financeira"
                    description={getAnalysisMessage(balance)}
                    highlight={balanceHighlight}
                    className="mb-5"
                />
            </ScrollView>
        </View>
    );
}
