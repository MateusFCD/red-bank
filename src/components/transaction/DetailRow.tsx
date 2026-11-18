import { Text, View } from 'react-native';

export function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <View className="flex-row items-center justify-between mt-7">
            <Text className="text-[18px] font-medium text-[#8F8B89]">{label}</Text>
            <Text className="text-[17px] font-bold text-[#F5F5F5]">{value}</Text>
        </View>
    );
}
