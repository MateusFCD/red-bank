import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { BalanceCard } from '@/src/components/BalanceCard';
import { Button } from '@/src/components/Button';
import { FilterSheet } from '@/src/components/FilterSheet';
import { FilterButton } from '@/src/components/home/FilterButton';
import { ScreenTransition } from '@/src/components/ScreenTransition';
import { TransactionList } from '@/src/components/TransactionsList';
import { useAuth } from '@/src/hooks/useAuth';
import { useFilteredTransactions } from '@/src/hooks/useFilteredTransactions';
import { useTransactionFilters } from '@/src/hooks/useTransactionFilters';
import { useTransactions } from '@/src/hooks/useTransactions';
import { useTransactionSummary } from '@/src/hooks/useTransactionSummary';
import type { Transaction } from '@/src/interfaces';
import type { StackNavigationRoutes } from '@/src/routes/App.routes';
import { getFirstName } from '@/src/utils/format';

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();

    const { user } = useAuth();
    const { transactions, loading, loadingMore, hasMore, loadTransactions, loadMoreTransactions } =
        useTransactions();
    const { appliedFilterCount } = useTransactionFilters();
    const { filteredTransactions, categories } = useFilteredTransactions();
    const summary = useTransactionSummary(transactions);

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadTransactions();
        setRefreshing(false);
    }, [loadTransactions]);

    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, [loadTransactions]),
    );

    const firstName = getFirstName(user?.displayName);

    // Referência estável para não invalidar o memo dos itens da lista.
    const openTransaction = useCallback(
        (transaction: Transaction) => navigation.navigate('TransactionDetails', { transaction }),
        [navigation],
    );

    return (
        <ScreenTransition className="bg-[#111111]">
            <View className="p-6 flex-1 bg-[#111111]">
                <View className="flex-row items-center justify-between">
                    <Text className="text-[32px] font-bold text-[#F5F5F5]">
                        Olá{firstName ? `, ${firstName}` : ''}
                    </Text>

                    <View className="flex-row items-center gap-2.5">
                        <FilterButton activeCount={appliedFilterCount} onPress={() => setFiltersOpen(true)} />

                        <Button
                            variant="primary"
                            onPress={() => navigation.navigate('AddTransaction', { transaction: undefined })}
                        >
                            + Nova
                        </Button>
                    </View>
                </View>

                <BalanceCard {...summary} />

                <TransactionList
                    transactions={filteredTransactions}
                    loading={loading}
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    onLoadMore={loadMoreTransactions}
                    onPressItem={openTransaction}
                />

                <FilterSheet
                    visible={filtersOpen}
                    onClose={() => setFiltersOpen(false)}
                    categories={categories}
                />
            </View>
        </ScreenTransition>
    );
}
