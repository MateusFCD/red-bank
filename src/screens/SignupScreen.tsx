import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { FormField } from '@/src/components/FormField';
import { Input } from '@/src/components/Input';
import { ChevronLeftIcon } from '@/src/components/icons';
import { colors, fonts, textMuted } from '@/src/theme/colors';
import { StackNavigationRoutes } from "@/src/routes/App.routes";

export function SignupScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();

    const goLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <KeyboardAvoidingView style={ styles.flex } behavior={ Platform.OS === 'ios' ? 'padding' : undefined }>
            <ScrollView
                contentContainerStyle={ [styles.container, { paddingTop: insets.top + 40 }] }
                showsVerticalScrollIndicator={ false }
                keyboardShouldPersistTaps="handled"
            >
                <Pressable style={ styles.back } onPress={ goLogin } hitSlop={ 8 }>
                    <ChevronLeftIcon size={ 19 } color={ colors.text }/>
                </Pressable>

                <Text style={ styles.brand }>Criar conta</Text>
                <Text style={ styles.subtitle }>Leva menos de um minuto</Text>

                <View style={ styles.fields }>
                    <FormField label="Nome">
                        <Input
                            placeholder="Seu nome completo"
                            autoCapitalize="words"
                        />
                    </FormField>

                    <FormField label="E-mail">
                        <Input
                            placeholder="voce@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                    </FormField>

                    <FormField label="Senha">
                        <Input
                            placeholder="Mínimo 6 caracteres"
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </FormField>

                    <FormField label="Confirmar senha">
                        <Input
                            placeholder="Repita a senha"
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </FormField>

                    <Button
                        variant="primary"
                        block
                        style={ styles.submit }
                    >
                        Criar conta
                    </Button>
                </View>

                <View style={ styles.footer }>
                    <Text style={ styles.footerText }>Já tem conta?</Text>
                    <Button variant="ghost" onPress={ goLogin }>
                        Entrar
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: {
        flexGrow: 1,
        paddingHorizontal: 26,
        paddingBottom: 30,
        backgroundColor: colors.bg,
    },
    back: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },
    brand: {
        fontFamily: fonts.heading,
        fontSize: 26,
        color: colors.text,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 13,
        color: textMuted(0.6),
        marginBottom: 28,
        fontFamily: fonts.body,
    },
    fields: { gap: 14 },
    generalError: {
        backgroundColor: 'rgba(236, 48, 19, 0.14)',
        borderRadius: 10,
        paddingVertical: 9,
        paddingHorizontal: 12,
    },
    generalErrorText: { color: colors.accent300, fontSize: 12.5, fontFamily: fonts.body },
    submit: { marginTop: 6 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        marginTop: 22,
    },
    footerText: { fontSize: 13, color: colors.text, fontFamily: fonts.body },
});
