import {
    Pressable,
    StyleSheet,
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
import { useAppContext } from "@/src/hooks/useAppContext";

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
        <View style={ styles.container }>
            <View style={ styles.header }>
                <Pressable
                    onPress={ () => navigation.goBack() }
                    style={ styles.backButton }
                >
                    <Text style={ styles.backIcon }>‹</Text>
                </Pressable>

                <Text style={ styles.title }>
                    Detalhes
                </Text>
            </View>

            <View style={ styles.divider }/>

            <View style={ styles.content }>
                <View style={ styles.transactionCard }>
                    <View style={ styles.categoryBadge }>
                        <Text style={ styles.categoryText }>
                            { transaction.category }
                        </Text>
                    </View>

                    <Text
                        style={ [
                            styles.amount,
                            isIncome
                                ? styles.income
                                : styles.expense,
                        ] }
                    >
                        { isIncome ? "+" : "-" }{ " " }
                        { formatCurrency(transaction.amount) }
                    </Text>

                    <Text style={ styles.description }>
                        { transaction.desc }
                    </Text>
                </View>

                <View style={ styles.infoRow }>
                    <Text style={ styles.infoLabel }>
                        Data
                    </Text>

                    <Text style={ styles.infoValue }>
                        { formattedDate }
                    </Text>
                </View>

                <View style={ styles.infoRow }>
                    <Text style={ styles.infoLabel }>
                        Tipo
                    </Text>

                    <Text style={ styles.infoValue }>
                        { isIncome ? "Receita" : "Despesa" }
                    </Text>
                </View>

                <View style={ styles.actions }>
                    <Pressable style={ styles.editButton } onPress={ handleEdit }>
                        <Text style={ styles.editText }>
                            Editar
                        </Text>
                    </Pressable>

                    <Pressable style={ styles.deleteButton } onPress={ handleDelete }>
                        <Text style={ styles.deleteText }>
                            Excluir
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111111",
    },

    header: {
        height: 82,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 28,
        paddingTop: 12,
    },

    backButton: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    backIcon: {
        fontSize: 32,
        lineHeight: 34,
        fontWeight: "300",
        color: "#F5F5F5",
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#F5F5F5",
    },

    divider: {
        height: 2,
        backgroundColor: "#333333",
    },

    content: {
        paddingHorizontal: 28,
        paddingTop: 32,
    },

    transactionCard: {
        backgroundColor: "#1C1A19",
        borderRadius: 28,
        padding: 24,
        height: 185,
    },

    categoryBadge: {
        alignSelf: "flex-start",
        borderWidth: 1.5,
        borderColor: "#FF321E",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },

    categoryText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#FF321E",
    },

    amount: {
        marginTop: 26,
        fontSize: 32,
        fontWeight: "800",
        color: "#F5F5F5",
    },

    income: {
        color: "#65D39A",
    },

    expense: {
        color: "#F5F5F5",
    },

    description: {
        marginTop: 14,
        fontSize: 17,
        fontWeight: "500",
        color: "#96918F",
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 28,
    },

    infoLabel: {
        fontSize: 18,
        fontWeight: "500",
        color: "#8F8B89",
    },

    infoValue: {
        fontSize: 17,
        fontWeight: "700",
        color: "#F5F5F5",
    },

    actions: {
        flexDirection: "row",
        gap: 14,
        marginTop: 38,
    },

    editButton: {
        flex: 1,
        height: 54,
        borderWidth: 1.5,
        borderColor: "#383635",
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },

    editText: {
        fontSize: 20,
        fontWeight: "800",
        color: "#F5F5F5",
    },

    deleteButton: {
        flex: 1,
        height: 54,
        borderWidth: 1.5,
        borderColor: "#FF321E",
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },

    deleteText: {
        fontSize: 20,
        fontWeight: "800",
        color: "#FF8D80",
    },
});