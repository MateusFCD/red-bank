import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button } from '@/src/components/Button';
import { DateField } from '@/src/components/DateField';
import { FormField } from '@/src/components/FormField';
import { Input } from '@/src/components/Input';
import { ScreenTransition } from '@/src/components/ScreenTransition';
import { SelectField, type SelectOption } from '@/src/components/SelectField';
import { ReceiptPicker } from '@/src/components/transaction/ReceiptPicker';
import { TransactionTypeToggle } from '@/src/components/transaction/TransactionTypeToggle';
import { CATEGORIES, catColor } from '@/src/data/categories';
import { useTransactionForm } from '@/src/hooks/useTransactionForm';
import type { StackNavigationRoutes } from '@/src/routes/App.routes';

const CATEGORY_OPTIONS: SelectOption[] = CATEGORIES.map((name) => ({
    value: name,
    label: name,
    color: catColor(name),
}));

export function AddTransactionScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();
    const route = useRoute<RouteProp<StackNavigationRoutes, 'AddTransaction'>>();

    const { form, errors, saving, isEditing, updateField, submit } = useTransactionForm(
        route.params?.transaction,
    );

    async function handleSave() {
        const saved = await submit();
        if (!saved) return;

        Toast.show({
            type: 'success',
            text1: isEditing ? 'Transação atualizada!' : 'Transação salva!',
            text2: isEditing
                ? 'As alterações foram salvas com sucesso.'
                : 'Sua transação foi adicionada com sucesso.',
        });

        navigation.goBack();
    }

    return (
        <ScreenTransition className="bg-app">
            <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    className="flex-1"
                    contentContainerClassName="grow bg-app px-[26px] pt-[45px] pb-10"
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-row items-center mb-[30px]">
                        <Button variant="ghost" onPress={() => navigation.goBack()}>
                            ←
                        </Button>

                        <Text className="flex-1 font-heading text-[28px] text-ink text-center">
                            {isEditing ? 'Editar transação' : 'Nova transação'}
                        </Text>

                        <View className="w-10" />
                    </View>

                    <View className="gap-5">
                        <FormField label="Descrição" error={errors.desc}>
                            <Input
                                placeholder="Ex: Supermercado"
                                value={form.desc}
                                onChangeText={(value) => updateField('desc', value)}
                            />
                        </FormField>

                        <FormField label="Valor" error={errors.amount}>
                            <View className="flex-row items-center gap-2.5">
                                <Text className="font-heading text-[18px] text-ink">R$</Text>
                                <Input
                                    className="flex-1"
                                    placeholder="0,00"
                                    keyboardType="decimal-pad"
                                    value={form.amount}
                                    onChangeText={(value) => updateField('amount', value)}
                                />
                            </View>
                        </FormField>

                        <TransactionTypeToggle value={form.type} onChange={(type) => updateField('type', type)} />

                        <SelectField
                            label="Categoria"
                            value={form.category}
                            options={CATEGORY_OPTIONS}
                            onChange={(category) => updateField('category', category)}
                            error={errors.category}
                        />

                        <DateField
                            label="Data"
                            value={form.date}
                            onChange={(date) => updateField('date', date)}
                            placeholder="Selecione uma data"
                            error={errors.date}
                        />

                        <ReceiptPicker value={form.receipt} onChange={(uri) => updateField('receipt', uri)} />
                    </View>

                    <Button variant="primary" block className="mt-[30px]" onPress={handleSave} loading={saving}>
                        {isEditing ? 'Salvar alterações' : 'Salvar transação'}
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenTransition>
    );
}
