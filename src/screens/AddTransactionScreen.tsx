import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { ScreenTransition } from "@/src/components/ScreenTransition";
import type {
    TransactionFormErrors,
    TransactionFormState,
    TransactionType,
} from "@/src/interfaces";
import type { StackNavigationRoutes } from "@/src/routes/App.routes";
import { cn } from "@/src/utils/cn";

import { CATEGORIES } from "@/src/data/categories";

import Toast from "react-native-toast-message";
import { formatDateDisplay } from "@/src/utils/format";
import { useAppContext } from "@/src/hooks/useAppContext";

const categories = CATEGORIES;

export function AddTransactionScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();

    const route = useRoute<RouteProp<StackNavigationRoutes, "AddTransaction">>();

    const transaction = route.params?.transaction;

    const isEditing = !!transaction;

    const { createTransaction, editTransaction } = useAppContext();

    const [form, setForm] = useState<TransactionFormState>({
        desc: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[ 0 ],
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
                receipt: transaction.receipt,
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

        updateField("date", `${ year }-${ month }-${ day }`);
    }

    function updateField<K extends keyof TransactionFormState>(
        field: K,
        value: TransactionFormState[K],
    ) {
        setForm(( current ) => ( {
            ...current,
            [ field ]: value,
        } ));

        setErrors(( current ) => ( {
            ...current,
            [ field ]: undefined,
        } ));
    }

    function selectType( type: TransactionType ) {
        updateField("type", type);
    }

    function selectCategory( category: string ) {
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
            date: new Date().toISOString().split("T")[ 0 ],
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
                await editTransaction(transaction.id, transactionData);

                Toast.show({
                    type: "success",
                    text1: "Transação atualizada!",
                    text2: "As alterações foram salvas com sucesso.",
                });
            } else {
                await createTransaction(transactionData);

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

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert("É necessário permitir o acesso à galeria.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const base64Image = `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`;
            setForm(prev => ({ ...prev, receipt: base64Image }));
        }
    };

    return (
        <ScreenTransition className="bg-app">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={ Platform.OS === "ios" ? "padding" : undefined }
            >
            <ScrollView
                className="flex-1"
                contentContainerClassName="grow bg-app px-[26px] pt-[45px] pb-10"
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-row items-center mb-[30px]">
                    <Button
                        variant="ghost"
                        onPress={ () => navigation.goBack() }
                    >
                        ←
                    </Button>

                    <Text className="flex-1 font-heading text-[28px] text-ink text-center">
                        { isEditing ? "Editar transação" : "Nova transação" }
                    </Text>

                    <View className="w-10"/>
                </View>

                <View className="gap-5">
                    <View>
                        <Text className="font-body text-[15px] text-ink mb-2">Descrição</Text>

                        <Input
                            placeholder="Ex: Supermercado"
                            value={ form.desc }
                            onChangeText={ ( value ) =>
                                updateField("desc", value)
                            }
                        />

                        { errors.desc && (
                            <Text className="mt-[5px] font-body text-[12px] text-brand-300">
                                { errors.desc }
                            </Text>
                        ) }
                    </View>

                    <View>
                        <Text className="font-body text-[15px] text-ink mb-2">Valor</Text>

                        <View className="flex-row items-center gap-2.5">
                            <Text className="font-heading text-[18px] text-ink">R$</Text>

                            <Input
                                className="flex-1"
                                placeholder="0,00"
                                keyboardType="decimal-pad"
                                value={ form.amount }
                                onChangeText={ ( value ) =>
                                    updateField("amount", value)
                                }
                            />
                        </View>

                        { errors.amount && (
                            <Text className="mt-[5px] font-body text-[12px] text-brand-300">
                                { errors.amount }
                            </Text>
                        ) }
                    </View>

                    <View className="flex-row gap-2.5">
                        <Button
                            variant={
                                form.type === "expense"
                                    ? "primary"
                                    : "secondary"
                            }
                            className="flex-1"
                            onPress={ () => selectType("expense") }
                        >
                            Despesa
                        </Button>

                        <Button
                            variant={
                                form.type === "income"
                                    ? "primary"
                                    : "secondary"
                            }
                            className="flex-1"
                            onPress={ () => selectType("income") }
                        >
                            Receita
                        </Button>
                    </View>

                    <View>
                        <Text className="font-body text-[15px] text-ink mb-2">Categoria</Text>

                        <Pressable
                            className="h-[52px] border border-ink/25 rounded-[8px] px-4 flex-row items-center justify-between"
                            onPress={ () =>
                                setCategoryModalVisible(true)
                            }
                        >
                            <Text
                                className={ cn(
                                    "font-body text-[16px]",
                                    form.category ? "text-ink" : "text-ink/60",
                                ) }
                            >
                                { form.category || "Selecione..." }
                            </Text>

                            <Text className="text-[22px] text-ink">⌄</Text>
                        </Pressable>

                        { errors.category && (
                            <Text className="mt-[5px] font-body text-[12px] text-brand-300">
                                { errors.category }
                            </Text>
                        ) }
                    </View>

                    <View>
                        <Text className="font-body text-[15px] text-ink mb-2">Data</Text>

                        <Pressable onPress={ () => setShowDatePicker(true) }>
                            <View pointerEvents="none">
                                <Input
                                    placeholder="Selecione uma data"
                                    value={ formatDateDisplay(form.date) }
                                />
                            </View>
                        </Pressable>

                        { showDatePicker && (
                            <DateTimePicker
                                value={
                                    form.date
                                        ? new Date(`${ form.date }T12:00:00`)
                                        : new Date()
                                }
                                mode="date"
                                display="default"
                                onChange={ handleDateChange }
                            />
                        ) }

                        { errors.date && (
                            <Text className="mt-[5px] font-body text-[12px] text-brand-300">
                                { errors.date }
                            </Text>
                        ) }
                    </View>
                    <View>
                        <Text className="font-body text-[15px] text-ink mb-2">
                            Recibo (opcional)
                        </Text>

                        {!form.receipt ? (
                            <Pressable
                                className="min-h-[100px] border border-dashed border-ink/35 rounded-[14px] items-center justify-center gap-2"
                                onPress={handlePickImage}
                            >
                                <Text className="text-[28px] text-ink/70">＋</Text>
                                <Text className="font-body text-[14px] text-ink/70">
                                    Adicionar comprovante
                                </Text>
                            </Pressable>
                        ) : (
                            <Pressable onPress={handlePickImage}>
                                <Image
                                    source={{ uri: form.receipt }}
                                    className="w-[360px] rounded-[8px] aspect-square mt-[30px]"
                                    resizeMode="contain"
                                />
                            </Pressable>
                        )}
                    </View>
                </View>

                <Button
                    variant="primary"
                    block
                    className="mt-[30px]"
                    onPress={ handleSave }
                >

                    { isEditing ? "Salvar alterações" : "Salvar transação" }
                </Button>

            </ScrollView>

            <Modal
                visible={ categoryModalVisible }
                transparent
                animationType="slide"
                onRequestClose={ () =>
                    setCategoryModalVisible(false)
                }
            >
                <Pressable
                    className="flex-1 justify-end bg-[rgba(0,0,0,0.6)]"
                    onPress={ () =>
                        setCategoryModalVisible(false)
                    }
                >
                    <Pressable
                        className="bg-app px-6 pt-6 pb-[35px] rounded-t-[24px]"
                        onPress={ ( event ) => event.stopPropagation() }
                    >
                        <Text className="font-heading text-[20px] text-ink mb-[18px]">
                            Escolha uma categoria
                        </Text>

                        { categories.map(( category ) => (
                            <Pressable
                                key={ category }
                                className="py-3.5 border-b border-b-ink/12"
                                onPress={ () =>
                                    selectCategory(category)
                                }
                            >
                                <Text className="font-body text-[16px] text-ink">
                                    { category }
                                </Text>
                            </Pressable>
                        )) }
                    </Pressable>
                </Pressable>
            </Modal>
            </KeyboardAvoidingView>
        </ScreenTransition>
    );
}
