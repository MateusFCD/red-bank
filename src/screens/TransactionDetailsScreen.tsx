import { Alert, Pressable, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ScreenTransition } from '@/src/components/ScreenTransition';
import { DetailRow } from '@/src/components/transaction/DetailRow';
import { TransactionSummaryCard } from '@/src/components/transaction/TransactionSummaryCard';
import { useTransactions } from '@/src/hooks/useTransactions';
import type { StackNavigationRoutes } from '@/src/routes/App.routes';
import { formatDateFull } from '@/src/utils/format';

type Navigation = NativeStackNavigationProp<StackNavigationRoutes, 'TransactionDetails'>;
type DetailsRoute = RouteProp<StackNavigationRoutes, 'TransactionDetails'>;

function confirmDelete(onConfirm: () => void) {
    Alert.alert('Excluir transação', 'Tem certeza que deseja excluir esta transação?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: onConfirm },
    ]);
}

export function TransactionDetailsScreen() {
    const navigation = useNavigation<Navigation>();
    const { transaction } = useRoute<DetailsRoute>().params;
    const { removeTransaction } = useTransactions();

    function handleEdit() {
        navigation.navigate('AddTransaction', { transaction });
    }

    function handleDelete() {
        confirmDelete(async () => {
            try {
                await removeTransaction(transaction.id);
                navigation.goBack();
            } catch (error) {
                console.log('🔥 ERRO AO EXCLUIR TRANSAÇÃO:', error);
                Alert.alert('Erro', 'Não foi possível excluir a transação.');
            }
        });
    }

    return (
        <ScreenTransition className="bg-[#111111]">
            <View className="flex-1 bg-[#111111]">
                <View className="h-[82px] flex-row items-center px-7 pt-3">
                    <Pressable
                        onPress={() => navigation.goBack()}
                        className="w-9 h-9 items-center justify-center mr-3.5"
                    >
                        <Text className="text-[32px] leading-[34px] font-light text-[#F5F5F5]">‹</Text>
                    </Pressable>

                    <Text className="text-[28px] font-extrabold text-[#F5F5F5]">Detalhes</Text>
                </View>

                <View className="h-0.5 bg-[#333333]" />

                <View className="px-7 pt-8">
                    <TransactionSummaryCard {...transaction} />

                    <DetailRow label="Data" value={formatDateFull(transaction.date)} />
                    <DetailRow label="Tipo" value={transaction.type === 'income' ? 'Receita' : 'Despesa'} />

                    <View className="flex-row gap-3.5 mt-[38px]">
                        <Pressable
                            className="flex-1 h-[54px] border-[1.5px] border-[#383635] rounded-[18px] items-center justify-center"
                            onPress={handleEdit}
                        >
                            <Text className="text-[20px] font-extrabold text-[#F5F5F5]">Editar</Text>
                        </Pressable>

                        <Pressable
                            className="flex-1 h-[54px] border-[1.5px] border-[#FF321E] rounded-[18px] items-center justify-center"
                            onPress={handleDelete}
                        >
                            <Text className="text-[20px] font-extrabold text-[#FF8D80]">Excluir</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenTransition>
    );
}
