import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { BellIcon, HelpCircleIcon, LockIcon } from '@/src/components/icons';
import { useAppContext } from '@/src/hooks/useAppContext';
import type { StackNavigationRoutes } from '@/src/routes/App.routes';
import { colors, fonts, radius, textMuted, withAlpha } from '@/src/theme/colors';

export function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const store = useAppContext();
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();
    const userName = store.user?.displayName || 'Usuário Fluxo';
    const userEmail = store.user?.email || 'usuario@email.com';
    const userInitial = ( ( store.user?.displayName || store.user?.email || 'U' ).trim()[ 0 ] || 'U' ).toUpperCase();

    return (
        <View style={ styles.screen }>
            <View style={ [styles.header, { paddingTop: insets.top + 14 }] }>
                <Text style={ styles.title }>Configurações</Text>
            </View>

            <ScrollView contentContainerStyle={ styles.body } showsVerticalScrollIndicator={ false }>
                <View style={ styles.profile }>
                    <View style={ styles.avatar }>
                        <Text style={ styles.avatarText }>{ userInitial }</Text>
                    </View>
                    <View style={ styles.profileInfo }>
                        <Text style={ styles.profileName } numberOfLines={ 1 }>
                            { userName }
                        </Text>
                        <Text style={ styles.profileEmail } numberOfLines={ 1 }>
                            { userEmail }
                        </Text>
                    </View>
                </View>

                <View style={ styles.list }>
                    <View style={ [styles.listRow, styles.listRowDivider] }>
                        <BellIcon size={ 17 } color={ colors.text }/>
                        <Text style={ styles.listLabel }>Notificações</Text>
                    </View>
                    <View style={ [styles.listRow, styles.listRowDivider] }>
                        <LockIcon size={ 17 } color={ colors.text }/>
                        <Text style={ styles.listLabel }>Segurança e senha</Text>
                    </View>
                    <View style={ styles.listRow }>
                        <HelpCircleIcon size={ 17 } color={ colors.text }/>
                        <Text style={ styles.listLabel }>Ajuda e suporte</Text>
                    </View>
                </View>

                <Button
                    variant="secondary"
                    style={ styles.logout }
                    textColor={ colors.accent400 }
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
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    header: { paddingHorizontal: 20, paddingBottom: 14 },
    title: { fontFamily: fonts.heading, fontSize: 20, color: colors.text },
    body: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 20, gap: 16 },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderRadius: radius.xl,
        backgroundColor: colors.surface,
        padding: 16,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: withAlpha(colors.accent, 0.25),
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontFamily: fonts.heading, fontSize: 18, color: colors.accent300 },
    profileInfo: { flex: 1, minWidth: 0 },
    profileName: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.text },
    profileEmail: { fontSize: 12.5, color: textMuted(0.55), marginTop: 2, fontFamily: fonts.body },
    list: { borderRadius: radius.xl, backgroundColor: colors.surface, overflow: 'hidden' },
    listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
    listRowDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
    listLabel: { fontSize: 14, color: colors.text, flex: 1, fontFamily: fonts.body },
    logout: { justifyContent: 'center', borderColor: colors.accent800 },
});
