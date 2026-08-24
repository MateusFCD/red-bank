import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { FormField } from '@/src/components/FormField';
import { Input } from '@/src/components/Input';
import { colors, fonts, textMuted } from '@/src/theme/colors';
import { StackNavigationRoutes } from "@/src/routes/App.routes";


export function LoginScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();

    function goSignup() {
        navigation.navigate('SignUp');
    }

    return (
        <KeyboardAvoidingView
            style={ styles.flex }
            behavior={ Platform.OS === 'ios' ? 'padding' : undefined }
        >
            <View style={ [styles.container, { paddingTop: insets.top + 40 }] }>
                <Text style={ styles.brand }>Red Bank</Text>
                <Text style={ styles.subtitle }>Entre com sua conta</Text>

                <View style={ styles.fields }>
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
                            placeholder="••••••••"
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </FormField>

                    <Button variant="ghost" style={ styles.forgot } onPress={ () => {
                    } }>
                        Esqueci minha senha
                    </Button>


                    <Button
                        variant="primary"
                        block
                        style={ styles.submit }
                        onPress={ () => navigation.reset({
                            index: 0,
                            routes: [{ name: 'Bottom' }]
                        }) }
                    >
                        Entrar
                    </Button>
                </View>

                <View style={ styles.flex }/>

                <Text style={ styles.protected }>Protegido pelo Firebase Authentication</Text>
                <View style={ styles.footer }>
                    <Text style={ styles.footerText }>Não tem conta?</Text>
                    <Button variant="ghost" onPress={ goSignup }>
                        Cadastre-se
                    </Button>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: {
        flex: 1,
        paddingHorizontal: 26,
        paddingBottom: 30,
        backgroundColor: colors.bg,
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
        marginBottom: 32,
        fontFamily: fonts.body,
    },
    fields: { gap: 14 },
    forgot: { alignSelf: 'flex-end' },
    generalError: {
        backgroundColor: 'rgba(236, 48, 19, 0.14)',
        borderRadius: 10,
        paddingVertical: 9,
        paddingHorizontal: 12,
    },
    generalErrorText: { color: colors.accent300, fontSize: 12.5, fontFamily: fonts.body },
    submit: { marginTop: 6 },
    protected: {
        fontSize: 12.5,
        color: textMuted(0.6),
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: fonts.body,
    },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2 },
    footerText: { fontSize: 13, color: colors.text, fontFamily: fonts.body },
});
