import { Pressable, Text, View } from 'react-native';

import { FilterIcon } from '@/src/components/icons';
import { colors } from '@/src/theme/colors';

interface FilterButtonProps {
    activeCount: number;
    onPress: () => void;
}

export function FilterButton({ activeCount, onPress }: FilterButtonProps) {
    return (
        <Pressable
            className="w-9 h-9 rounded-md items-center justify-center bg-surface border border-divider"
            onPress={onPress}
        >
            <FilterIcon size={17} color={colors.text} knobFill={colors.surface} />
            {activeCount > 0 ? (
                <View className="absolute -top-1.5 -right-1.5 min-w-4 h-4 rounded-[8px] bg-brand items-center justify-center px-[3px]">
                    <Text className="text-white text-[10px] font-heading">{activeCount}</Text>
                </View>
            ) : null}
        </Pressable>
    );
}
