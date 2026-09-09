import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { FormField } from '@/src/components/FormField';
import { Input } from '@/src/components/Input';
import { StackNavigationRoutes } from '@/src/routes/App.routes';
import { auth } from '@/src/services/firebase';
import { colors, fonts, textMuted } from '@/src/theme/colors';


export function LoginScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        });
    }, []);

    function goSignup() {
        navigation.navigate('SignUp');
    }

    function goHome() {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Bottom' }],
        });
    }

    async function handleLogin() {
        if (!email.trim() || !password) {
            setError('Informe seu e-mail e sua senha.');
            return;
        }

        try {
            setError('');
            setLoading(true);
            await signInWithEmailAndPassword(auth, email.trim(), password);
            goHome();
        } catch (error) {
            if (error && typeof error === 'object' && 'code' in error) {
                const code = String(error.code);

                if (code === 'auth/invalid-api-key' || code === 'auth/configuration-not-found') {
                    setError('A configuração do Firebase está inválida. Confira o arquivo .env.');
                    return;
                }
            }

            setError('E-mail ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        try {
            setError('');
            setLoading(true);

            await GoogleSignin.hasPlayServices();

            const response = await GoogleSignin.signIn();

            if (response.type !== 'success') {
                setLoading(false);
                return;
            }

            const idToken = response.data?.idToken;

            if (!idToken) {
                throw new Error('Google não retornou o ID token.');
            }

            const credential = GoogleAuthProvider.credential(idToken);

            await signInWithCredential(auth, credential);

            goHome();


        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível entrar com o Google.'
            );
        } finally {
            setLoading(false);
        }
    }


    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={[styles.container, { paddingTop: insets.top + 40 }]}>
                <Text style={styles.brand}>Red Bank</Text>
                <Text style={styles.subtitle}>Entre com sua conta</Text>

                <View style={styles.fields}>
                    <FormField label="E-mail">
                        <Input
                            placeholder="voce@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </FormField>

                    <FormField label="Senha">
                        <Input
                            placeholder="••••••••"
                            secureTextEntry
                            autoCapitalize="none"
                            value={password}
                            onChangeText={setPassword}
                        />
                    </FormField>

                    <Button variant="ghost" style={styles.forgot} onPress={() => { }}>
                        Esqueci minha senha
                    </Button>

                    <Button
                        variant="primary"
                        block
                        style={styles.submit}
                        onPress={handleLogin}
                        loading={loading}
                    >
                        Entrar
                    </Button>

                    <Button
                        variant="secondary"
                        block
                        onPress={handleGoogleLogin}
                        disabled={loading}
                    >
                        Entrar com Google
                    </Button>

                    {error ? (
                        <View style={styles.generalError}>
                            <Text style={styles.generalErrorText}>{error}</Text>
                        </View>
                    ) : null}
                </View>

                <View style={styles.flex} />
                <Text style={styles.protected}>Protegido pelo Firebase Authentication</Text>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Não tem conta?</Text>
                    <Button variant="ghost" onPress={goSignup}>Cadastre-se</Button>
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
