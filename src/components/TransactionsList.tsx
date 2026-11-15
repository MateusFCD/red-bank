import { memo, useCallback } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    Text,
    View,
    type ListRenderItem,
} from 'react-native';

import type { Transaction } from '@/src/interfaces';
import { colors } from '@/src/theme/colors';
import { cn } from '@/src/utils/cn';
import { formatCurrency, formatDateDisplay } from '@/src/utils/format';

interface TransactionListProps {
    transactions: Transaction[];
    /** Primeira página sendo carregada. */
    loading: boolean;
    /** Próxima página sendo carregada. */
    loadingMore: boolean;
    hasMore: boolean;
    refreshing: boolean;
    onRefresh: () => void;
    onLoadMore: () => void;
    onPressItem: (transaction: Transaction) => void;
}

const TransactionListItem = memo(function TransactionListItem({
    transaction,
    onPress,
}: {
    transaction: Transaction;
    onPress: (transaction: Transaction) => void;
}) {
    const isIncome = transaction.type === 'income';

    return (
        <Pressable
            className="flex-row items-center justify-between py-[18px] border-b border-b-ink/12"
            onPress={() => onPress(transaction)}
        >
            <View className="flex-1 mr-4">
                <Text className="text-[16px] font-semibold text-ink">{transaction.desc}</Text>
                <Text className="mt-[5px] text-[13px] text-ink/65">
                    {transaction.category} · {formatDateDisplay(transaction.date)}
                </Text>
            </View>

            <Text className={cn('text-[16px] font-bold', isIncome ? 'text-[#7FCF9A]' : 'text-brand-300')}>
                {isIncome ? '+' : '-'}
                {formatCurrency(transaction.amount)}
            </Text>
        </Pressable>
    );
});

function ListFooter({ loadingMore, hasMore, isEmpty }: { loadingMore: boolean; hasMore: boolean; isEmpty: boolean }) {
    if (loadingMore) return <ActivityIndicator className="my-5" color={colors.accent} />;
    if (!hasMore && !isEmpty) {
        return <Text className="my-5 text-center text-[12px] text-ink/45">Você chegou ao fim da lista.</Text>;
    }
    return null;
}

const keyExtractor = (item: Transaction) => item.id;

export function TransactionList({
    transactions,
    loading,
    loadingMore,
    hasMore,
    refreshing,
    onRefresh,
    onLoadMore,
    onPressItem,
}: TransactionListProps) {
    // `onEndReached` pode disparar várias vezes seguidas; só pede a próxima página
    // quando há mais dados e nenhuma requisição em andamento. Se a lista (ex.: filtrada)
    // não preencher a tela, ele dispara sozinho e continua buscando até preencher.
    const handleEndReached = useCallback(() => {
        if (!hasMore || loadingMore || loading) return;
        onLoadMore();
    }, [hasMore, loadingMore, loading, onLoadMore]);

    const renderItem = useCallback<ListRenderItem<Transaction>>(
        ({ item }) => <TransactionListItem transaction={item} onPress={onPressItem} />,
        [onPressItem],
    );

    const isEmpty = transactions.length === 0;

    return (
        <View className="flex-1 mt-8">
            <Text className="text-[22px] font-bold text-ink mb-[18px]">Transações recentes</Text>

            <FlatList
                data={transactions}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                // Lazy loading / paginação
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.4}
                // Virtualização: renderiza só o que está perto da área visível
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                windowSize={7}
                removeClippedSubviews
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.accent}
                        colors={[colors.accent]}
                    />
                }
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator className="my-8" color={colors.accent} />
                    ) : (
                        <Text className="text-[14px] text-ink/65">Nenhuma transação encontrada.</Text>
                    )
                }
                ListFooterComponent={<ListFooter loadingMore={loadingMore} hasMore={hasMore} isEmpty={isEmpty} />}
            />
        </View>
    );
}
