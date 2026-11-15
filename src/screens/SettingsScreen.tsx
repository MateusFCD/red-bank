import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { BellIcon, HelpCircleIcon, LockIcon } from '@/src/components/icons';
import { ScreenTransition } from '@/src/components/ScreenTransition';
import { useAppContext } from '@/src/hooks/useAppContext';
import type { StackNavigationRoutes } from '@/src/routes/App.routes';
import { colors } from '@/src/theme/colors';

export function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const store = useAppContext();
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();
    const userName = store.user?.displayName || 'Usuário Fluxo';
    const userEmail = store.user?.email || 'usuario@email.com';
    const userInitial = ( ( store.user?.displayName || store.user?.email || 'U' ).trim()[ 0 ] || 'U' ).toUpperCase();

    return (
        <ScreenTransition className="bg-app">
            <View className="flex-1 bg-app">
                <View className="px-5 pb-3.5" style={ { paddingTop: insets.top + 14 } }>
                    <Text className="font-heading text-[20px] text-ink">Configurações</Text>
                </View>

                <ScrollView contentContainerClassName="px-5 pt-1.5 pb-5 gap-4" showsVerticalScrollIndicator={ false }>
                    <View className="flex-row items-center gap-3.5 rounded-xl bg-surface p-4">
                        <View className="w-[52px] h-[52px] rounded-[26px] bg-brand/25 items-center justify-center">
                            <Text className="font-heading text-[18px] text-brand-300">{ userInitial }</Text>
                        </View>
                        <View className="flex-1 min-w-0">
                            <Text className="font-body-medium text-[15px] text-ink" numberOfLines={ 1 }>
                                { userName }
                            </Text>
                            <Text className="text-[12.5px] text-ink/55 mt-0.5 font-body" numberOfLines={ 1 }>
                                { userEmail }
                            </Text>
                        </View>
                    </View>

                    <View className="rounded-xl bg-surface overflow-hidden">
                        <View className="flex-row items-center gap-3 py-3.5 px-4 border-b border-b-divider">
                            <BellIcon size={ 17 } color={ colors.text }/>
                            <Text className="text-[14px] text-ink flex-1 font-body">Notificações</Text>
                        </View>
                        <View className="flex-row items-center gap-3 py-3.5 px-4 border-b border-b-divider">
                            <LockIcon size={ 17 } color={ colors.text }/>
                            <Text className="text-[14px] text-ink flex-1 font-body">Segurança e senha</Text>
                        </View>
                        <View className="flex-row items-center gap-3 py-3.5 px-4">
                            <HelpCircleIcon size={ 17 } color={ colors.text }/>
                            <Text className="text-[14px] text-ink flex-1 font-body">Ajuda e suporte</Text>
                        </View>
                    </View>

                    <Button
                        variant="secondary"
                        className="justify-center !border-brand-800"
                        textClassName="text-brand-400"
                        onPress={ async () => {
                            await store.logout();
                            navigation
                                .getParent<NativeStackNavigationProp<StackNavigationRoutes>>()
                                ?.reset({ index: 0, routes: [{ name: 'Login' }] });
                        } }
                    >
                        Sair da conta
                    </Button>
                </ScrollView>
            </View>
        </ScreenTransition>
    );
}
