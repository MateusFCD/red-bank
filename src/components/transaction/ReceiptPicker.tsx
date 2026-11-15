import { Alert, Image, Pressable, Text } from 'react-native';

import { FormField } from '@/src/components/FormField';
import { pickImageAsDataUri } from '@/src/services/imagePicker';

interface ReceiptPickerProps {
    value: string | null;
    onChange: (dataUri: string) => void;
}

export function ReceiptPicker({ value, onChange }: ReceiptPickerProps) {
    async function handlePick() {
        const result = await pickImageAsDataUri();

        if (result.status === 'denied') {
            Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria.');
            return;
        }

        if (result.status === 'picked') onChange(result.dataUri);
    }

    return (
        <FormField label="Recibo (opcional)">
            {value ? (
                <Pressable onPress={handlePick}>
                    <Image
                        source={{ uri: value }}
                        className="w-full rounded-[8px] aspect-square"
                        resizeMode="contain"
                    />
                </Pressable>
            ) : (
                <Pressable
                    className="min-h-[100px] border border-dashed border-ink/35 rounded-[14px] items-center justify-center gap-2"
                    onPress={handlePick}
                >
                    <Text className="text-[28px] text-ink/70">＋</Text>
                    <Text className="font-body text-[14px] text-ink/70">Adicionar comprovante</Text>
                </Pressable>
            )}
        </FormField>
    );
}
