import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { BellIcon, HelpCircleIcon, LockIcon } from '@/src/components/icons';
import { ScreenTransition } from '@/src/components/ScreenTransition';
import { ProfileCard } from '@/src/components/settings/ProfileCard';
import { SettingsMenu, type SettingsMenuItem } from '@/src/components/settings/SettingsMenu';
import { useAuth } from '@/src/hooks/useAuth';
import type { StackNavigationRoutes } from '@/src/routes/App.routes';
import { getUserDisplayInfo } from '@/src/utils/user';

const MENU_ITEMS: SettingsMenuItem[] = [
    { label: 'Notificações', Icon: BellIcon },
    { label: 'Segurança e senha', Icon: LockIcon },
    { label: 'Ajuda e suporte', Icon: HelpCircleIcon },
];

export function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();
    const { user, logout } = useAuth();

    async function handleLogout() {
        await logout();
        navigation
            .getParent<NativeStackNavigationProp<StackNavigationRoutes>>()
            ?.reset({ index: 0, routes: [{ name: 'Login' }] });
    }

    return (
        <ScreenTransition className="bg-app">
            <View className="flex-1 bg-app">
                <View className="px-5 pb-3.5" style={{ paddingTop: insets.top + 14 }}>
                    <Text className="font-heading text-[20px] text-ink">Configurações</Text>
                </View>

                <ScrollView contentContainerClassName="px-5 pt-1.5 pb-5 gap-4" showsVerticalScrollIndicator={false}>
                    <ProfileCard {...getUserDisplayInfo(user)} />

                    <SettingsMenu items={MENU_ITEMS} />

                    <Button
                        variant="secondary"
                        className="justify-center !border-brand-800"
                        textClassName="text-brand-400"
                        onPress={handleLogout}
                    >
                        Sair da conta
                    </Button>
                </ScrollView>
            </View>
        </ScreenTransition>
    );
}
