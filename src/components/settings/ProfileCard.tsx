import { Text, View } from 'react-native';

interface ProfileCardProps {
    name: string;
    email: string;
    initial: string;
}

export function ProfileCard({ name, email, initial }: ProfileCardProps) {
    return (
        <View className="flex-row items-center gap-3.5 rounded-xl bg-surface p-4">
            <View className="w-[52px] h-[52px] rounded-[26px] bg-brand/25 items-center justify-center">
                <Text className="font-heading text-[18px] text-brand-300">{initial}</Text>
            </View>
            <View className="flex-1 min-w-0">
                <Text className="font-body-medium text-[15px] text-ink" numberOfLines={1}>
                    {name}
                </Text>
                <Text className="text-[12.5px] text-ink/55 mt-0.5 font-body" numberOfLines={1}>
                    {email}
                </Text>
            </View>
        </View>
    );
}
