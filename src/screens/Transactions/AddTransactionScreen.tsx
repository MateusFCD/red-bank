import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import type {
    TransactionFormErrors,
    TransactionFormState,
    TransactionType,
} from "@/src/interfaces";
import type { StackNavigationRoutes } from "@/src/routes/App.routes";
import { colors, fonts, textMuted } from "@/src/theme/colors";

import { addTransaction, updateTransaction } from "@/src/services/transactions";

import Toast from "react-native-toast-message";
import { formatDateDisplay } from "@/src/utils/format";

const categories = [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Saúde",
    "Lazer",
    "Compras",
    "Educação",
    "Salário",
    "Outros",
];

export function AddTransactionScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();

    const route = useRoute<RouteProp<StackNavigationRoutes, "AddTransaction">>();

    const transaction = route.params?.transaction;

    const isEditing = !!transaction;

    const [form, setForm] = useState<TransactionFormState>({
        desc: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
        receipt: null,
        receiptName: "",
    });

    useEffect(() => {
        if (transaction) {
            setForm({
                desc: transaction.desc,
                amount: transaction.amount.toString().replace(".", ","),
                type: transaction.type,
                category: transaction.category,
                date: transaction.date,
                receipt: transaction.receipt ?? null,
                receiptName: "",
            });
        }
    }, [transaction]);

    const [errors, setErrors] = useState<TransactionFormErrors>({});
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);


    function handleDateChange(
        event: any,
        selectedDate?: Date
    ) {
        setShowDatePicker(false);

        if (!selectedDate) return;

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");

        updateField("date", `${year}-${month}-${day}`);
    }

    function updateField<K extends keyof TransactionFormState>(
        field: K,
        value: TransactionFormState[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
    }

    function selectType(type: TransactionType) {
        updateField("type", type);
    }

    function selectCategory(category: string) {
        updateField("category", category);
        setCategoryModalVisible(false);
    }

    function validate() {
        const newErrors: TransactionFormErrors = {};

        if (!form.desc.trim()) {
            newErrors.desc = "Informe uma descrição.";
        }

        const normalizedAmount = form.amount
            .replace(/\./g, "")
            .replace(",", ".");

        const amount = Number(normalizedAmount);

        if (!form.amount.trim()) {
            newErrors.amount = "Informe um valor.";
        } else if (Number.isNaN(amount) || amount <= 0) {
            newErrors.amount = "Informe um valor válido.";
        }

        if (!form.category) {
            newErrors.category = "Selecione uma categoria.";
        }

        if (!form.date.trim()) {
            newErrors.date = "Informe uma data.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function resetForm() {
        setForm({
            desc: "",
            amount: "",
            type: "expense",
            category: "",
            date: new Date().toISOString().split("T")[0],
            receipt: null,
            receiptName: "",
        });

        setErrors({});
    }

    async function handleSave() {
        if (!validate()) return;

        try {
            setLoading(true);

            const normalizedAmount = form.amount
                .replace(/\./g, "")
                .replace(",", ".");

            const transactionData = {
                desc: form.desc.trim(),
                amount: Number(normalizedAmount),
                type: form.type,
                category: form.category,
                date: form.date,
                receipt: form.receipt,
            };

            if (isEditing) {
                await updateTransaction(transaction.id, transactionData);

                Toast.show({
                    type: "success",
                    text1: "Transação atualizada!",
                    text2: "As alterações foram salvas com sucesso.",
                });
            } else {
                await addTransaction(transactionData);

                Toast.show({
                    type: "success",
                    text1: "Transação salva!",
                    text2: "Sua transação foi adicionada com sucesso.",
                });
            }

            resetForm();
            navigation.goBack();

        } catch (error) {
            setErrors({
                desc: isEditing
                    ? "Não foi possível atualizar a transação."
                    : "Não foi possível salvar a transação.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                style={styles.flex}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Button
                        variant="ghost"
                        onPress={() => navigation.goBack()}
                    >
                        ←
                    </Button>

                    <Text style={styles.title}>
                        {isEditing ? "Editar transação" : "Nova transação"}
                    </Text>

                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.fields}>
                    <View>
                        <Text style={styles.label}>Descrição</Text>

                        <Input
                            placeholder="Ex: Supermercado"
                            value={form.desc}
                            onChangeText={(value) =>
                                updateField("desc", value)
                            }
                        />

                        {errors.desc && (
                            <Text style={styles.error}>
                                {errors.desc}
                            </Text>
                        )}
                    </View>

                    <View>
                        <Text style={styles.label}>Valor</Text>

                        <View style={styles.amountContainer}>
                            <Text style={styles.currency}>R$</Text>

                            <Input
                                style={styles.amountInput}
                                placeholder="0,00"
                                keyboardType="decimal-pad"
                                value={form.amount}
                                onChangeText={(value) =>
                                    updateField("amount", value)
                                }
                            />
                        </View>

                        {errors.amount && (
                            <Text style={styles.error}>
                                {errors.amount}
                            </Text>
                        )}
                    </View>

                    <View style={styles.typeContainer}>
                        <Button
                            variant={
                                form.type === "expense"
                                    ? "primary"
                                    : "secondary"
                            }
                            style={styles.typeButton}
                            onPress={() => selectType("expense")}
                        >
                            Despesa
                        </Button>

                        <Button
                            variant={
                                form.type === "income"
                                    ? "primary"
                                    : "secondary"
                            }
                            style={styles.typeButton}
                            onPress={() => selectType("income")}
                        >
                            Receita
                        </Button>
                    </View>

                    <View>
                        <Text style={styles.label}>Categoria</Text>

                        <Pressable
                            style={styles.select}
                            onPress={() =>
                                setCategoryModalVisible(true)
                            }
                        >
                            <Text
                                style={[
                                    styles.selectText,
                                    !form.category &&
                                    styles.placeholder,
                                ]}
                            >
                                {form.category || "Selecione..."}
                            </Text>

                            <Text style={styles.arrow}>⌄</Text>
                        </Pressable>

                        {errors.category && (
                            <Text style={styles.error}>
                                {errors.category}
                            </Text>
                        )}
                    </View>

                    <View>
                        <Text style={styles.label}>Data</Text>

                        <Pressable onPress={() => setShowDatePicker(true)}>
                            <View pointerEvents="none">
                                <Input
                                    placeholder="Selecione uma data"
                                    value={formatDateDisplay(form.date)}
                                />
                            </View>
                        </Pressable>

                        {showDatePicker && (
                            <DateTimePicker
                                value={
                                    form.date
                                        ? new Date(`${form.date}T12:00:00`)
                                        : new Date()
                                }
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}

                        {errors.date && (
                            <Text style={styles.error}>
                                {errors.date}
                            </Text>
                        )}
                    </View>

                    <View>
                        <Text style={styles.label}>
                            Recibo (opcional)
                        </Text>

                        <Pressable style={styles.receipt}>
                            <Text style={styles.receiptIcon}>＋</Text>

                            <Text style={styles.receiptText}>
                                Adicionar comprovante
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <Button
                    variant="primary"
                    block
                    style={styles.saveButton}
                    onPress={handleSave}
                >

                    {isEditing ? "Salvar alterações" : "Salvar transação"}
                </Button>

            </ScrollView>

            <Modal
                visible={categoryModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() =>
                    setCategoryModalVisible(false)
                }
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() =>
                        setCategoryModalVisible(false)
                    }
                >
                    <Pressable
                        style={styles.modal}
                        onPress={(event) => event.stopPropagation()}
                    >
                        <Text style={styles.modalTitle}>
                            Escolha uma categoria
                        </Text>

                        {categories.map((category) => (
                            <Pressable
                                key={category}
                                style={styles.categoryOption}
                                onPress={() =>
                                    selectCategory(category)
                                }
                            >
                                <Text style={styles.categoryText}>
                                    {category}
                                </Text>
                            </Pressable>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },

    container: {
        flexGrow: 1,
        backgroundColor: colors.bg,
        paddingHorizontal: 26,
        paddingTop: 45,
        paddingBottom: 40,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
    },

    title: {
        flex: 1,
        fontFamily: fonts.heading,
        fontSize: 28,
        color: colors.text,
        textAlign: "center",
    },

    headerSpacer: {
        width: 40,
    },

    fields: {
        gap: 20,
    },

    label: {
        fontFamily: fonts.body,
        fontSize: 15,
        color: colors.text,
        marginBottom: 8,
    },

    amountContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    currency: {
        fontFamily: fonts.heading,
        fontSize: 18,
        color: colors.text,
    },

    amountInput: {
        flex: 1,
    },

    typeContainer: {
        flexDirection: "row",
        gap: 10,
    },

    typeButton: {
        flex: 1,
    },

    select: {
        height: 52,
        borderWidth: 1,
        borderColor: textMuted(0.25),
        borderRadius: 8,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    selectText: {
        fontFamily: fonts.body,
        fontSize: 16,
        color: colors.text,
    },

    placeholder: {
        color: textMuted(0.6),
    },

    arrow: {
        fontSize: 22,
        color: colors.text,
    },

    receipt: {
        minHeight: 100,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: textMuted(0.35),
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    receiptIcon: {
        fontSize: 28,
        color: textMuted(0.7),
    },

    receiptText: {
        fontFamily: fonts.body,
        fontSize: 14,
        color: textMuted(0.7),
    },

    error: {
        marginTop: 5,
        fontFamily: fonts.body,
        fontSize: 12,
        color: colors.accent300,
    },

    saveButton: {
        marginTop: 30,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },

    modal: {
        backgroundColor: colors.bg,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 35,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    modalTitle: {
        fontFamily: fonts.heading,
        fontSize: 20,
        color: colors.text,
        marginBottom: 18,
    },

    categoryOption: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: textMuted(0.12),
    },

    categoryText: {
        fontFamily: fonts.body,
        fontSize: 16,
        color: colors.text,
    },
});