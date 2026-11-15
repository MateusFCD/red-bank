import { View } from 'react-native';

import { Button } from '@/src/components/Button';
import type { TransactionType } from '@/src/interfaces';

const OPTIONS: { value: TransactionType; label: string }[] = [
    { value: 'expense', label: 'Despesa' },
    { value: 'income', label: 'Receita' },
];

interface TransactionTypeToggleProps {
    value: TransactionType;
    onChange: (type: TransactionType) => void;
}

export function TransactionTypeToggle({ value, onChange }: TransactionTypeToggleProps) {
    return (
        <View className="flex-row gap-2.5">
            {OPTIONS.map((option) => (
                <Button
                    key={option.value}
                    variant={value === option.value ? 'primary' : 'secondary'}
                    className="flex-1"
                    onPress={() => onChange(option.value)}
                >
                    {option.label}
                </Button>
            ))}
        </View>
    );
}
