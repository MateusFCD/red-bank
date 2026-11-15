import {
    Pressable,
    Text,
    View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type {
    NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import type {
    RouteProp,
} from "@react-navigation/native";

import type { StackNavigationRoutes } from "@/src/routes/App.routes";
import { Alert } from "react-native";
import { ScreenTransition } from "@/src/components/ScreenTransition";
import { useAppContext } from "@/src/hooks/useAppContext";
import { cn } from "@/src/utils/cn";

type Navigation = NativeStackNavigationProp<
    StackNavigationRoutes,
    "TransactionDetails"
>;

type DetailsRoute = RouteProp<
    StackNavigationRoutes,
    "TransactionDetails"
>;

export function TransactionDetailsScreen() {
    const navigation = useNavigation<Navigation>();
    const route = useRoute<DetailsRoute>();

    const { removeTransaction } = useAppContext();

    const { transaction } = route.params;

    const formatCurrency = ( value: number ) =>
        value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

    const formattedDate = new Date(
        `${ transaction.date }T12:00:00`
    ).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const isIncome = transaction.type === "income";

    async function handleEdit() {
        return navigation.navigate("AddTransaction", {
            transaction,
        });
    }

    async function handleDelete() {
        Alert.alert(
            "Excluir transação",
            "Tem certeza que deseja excluir esta transação?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeTransaction(transaction.id);

                            navigation.goBack();
                        } catch (error) {
                            console.log(
                                "🔥 ERRO AO EXCLUIR TRANSAÇÃO:",
                                error
                            );

                            Alert.alert(
                                "Erro",
                                "Não foi possível excluir a transação."
                            );
                        }
                    },
                },
            ]
        );
    }

    return (
        <ScreenTransition className="bg-[#111111]">
            <View className="flex-1 bg-[#111111]">
                <View className="h-[82px] flex-row items-center px-7 pt-3">
                <Pressable
                    onPress={ () => navigation.goBack() }
                    className="w-9 h-9 items-center justify-center mr-3.5"
                >
                    <Text className="text-[32px] leading-[34px] font-light text-[#F5F5F5]">‹</Text>
                </Pressable>

                <Text className="text-[28px] font-extrabold text-[#F5F5F5]">
                    Detalhes
                </Text>
            </View>

            <View className="h-0.5 bg-[#333333]"/>

            <View className="px-7 pt-8">
                <View className="bg-[#1C1A19] rounded-[28px] p-6 h-[185px]">
                    <View className="self-start border-[1.5px] border-[#FF321E] rounded-[20px] px-4 py-1.5">
                        <Text className="text-[15px] font-medium text-[#FF321E]">
                            { transaction.category }
                        </Text>
                    </View>

                    <Text
                        className={ cn(
                            "mt-[26px] text-[32px] font-extrabold",
                            isIncome ? "text-[#65D39A]" : "text-[#F5F5F5]",
                        ) }
                    >
                        { isIncome ? "+" : "-" }{ " " }
                        { formatCurrency(transaction.amount) }
                    </Text>

                    <Text className="mt-3.5 text-[17px] font-medium text-[#96918F]">
                        { transaction.desc }
                    </Text>
                </View>

                <View className="flex-row items-center justify-between mt-7">
                    <Text className="text-[18px] font-medium text-[#8F8B89]">
                        Data
                    </Text>

                    <Text className="text-[17px] font-bold text-[#F5F5F5]">
                        { formattedDate }
                    </Text>
                </View>

                <View className="flex-row items-center justify-between mt-7">
                    <Text className="text-[18px] font-medium text-[#8F8B89]">
                        Tipo
                    </Text>

                    <Text className="text-[17px] font-bold text-[#F5F5F5]">
                        { isIncome ? "Receita" : "Despesa" }
                    </Text>
                </View>

                <View className="flex-row gap-3.5 mt-[38px]">
                    <Pressable
                        className="flex-1 h-[54px] border-[1.5px] border-[#383635] rounded-[18px] items-center justify-center"
                        onPress={ handleEdit }
                    >
                        <Text className="text-[20px] font-extrabold text-[#F5F5F5]">
                            Editar
                        </Text>
                    </Pressable>

                    <Pressable
                        className="flex-1 h-[54px] border-[1.5px] border-[#FF321E] rounded-[18px] items-center justify-center"
                        onPress={ handleDelete }
                    >
                        <Text className="text-[20px] font-extrabold text-[#FF8D80]">
                            Excluir
                        </Text>
                    </Pressable>
                </View>
            </View>
            </View>
        </ScreenTransition>
    );
}
