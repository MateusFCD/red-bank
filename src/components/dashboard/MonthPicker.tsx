import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';

import { getMonthLabel, MONTHS } from '@/src/domain/dashboard';
import { cn } from '@/src/utils/cn';

interface MonthPickerProps {
    value: number;
    onChange: (month: number) => void;
}

export function MonthPicker({ value, onChange }: MonthPickerProps) {
    const [open, setOpen] = useState(false);

    function select(month: number) {
        onChange(month);
        setOpen(false);
    }

    return (
        <View className="w-full items-end mb-[15px]">
            <Pressable
                className="flex-row items-center bg-[#242121] px-2.5 py-1.5 rounded-[8px] self-end"
                onPress={() => setOpen(true)}
            >
                <Text className="text-[#D8D5D5] text-[18px] font-bold">{getMonthLabel(value)}</Text>
                <Text className="text-[#FF3B1F] text-[18px] ml-1">⌄</Text>
            </Pressable>

            <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
                <Pressable
                    className="flex-1 bg-[rgba(0,0,0,0.4)] justify-center items-center"
                    onPress={() => setOpen(false)}
                >
                    <View className="w-4/5 max-h-[50%] bg-app rounded-[12px] py-2 shadow-modal">
                        <FlatList
                            data={MONTHS}
                            keyExtractor={(item) => String(item.value)}
                            renderItem={({ item }) => {
                                const selected = item.value === value;

                                return (
                                    <Pressable className="py-3.5 px-5" onPress={() => select(item.value)}>
                                        <Text
                                            className={cn(
                                                'text-[18px]',
                                                selected ? 'font-bold text-[#FF3B1F]' : 'text-white',
                                            )}
                                        >
                                            {item.label}
                                        </Text>
                                    </Pressable>
                                );
                            }}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
