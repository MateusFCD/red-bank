import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { FormField } from '@/src/components/FormField';
import { Input } from '@/src/components/Input';
import { ScreenTransition } from '@/src/components/ScreenTransition';
import { StackNavigationRoutes } from '@/src/routes/App.routes';
import { auth } from '@/src/services/firebase';


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
        <ScreenTransition className="bg-app">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View
                    className="flex-1 px-[26px] pb-[30px] bg-app"
                    style={{ paddingTop: insets.top + 40 }}
                >
                    <Text className="font-heading text-[26px] text-ink mb-1.5">Red Bank</Text>
                    <Text className="text-[13px] text-ink/60 mb-8 font-body">Entre com sua conta</Text>

                    <View className="gap-3.5">
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

                        <Button variant="ghost" className="!self-end" onPress={() => { }}>
                            Esqueci minha senha
                        </Button>

                        <Button
                            variant="primary"
                            block
                            className="mt-1.5"
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
                            <View className="bg-brand/14 rounded-[10px] py-[9px] px-3">
                                <Text className="text-brand-300 text-[12.5px] font-body">{error}</Text>
                            </View>
                        ) : null}
                    </View>

                    <View className="flex-1" />
                    <Text className="text-[12.5px] text-ink/60 text-center mb-2.5 font-body">Protegido pelo Firebase Authentication</Text>
                    <View className="flex-row justify-center items-center gap-0.5">
                        <Text className="text-[13px] text-ink font-body">Não tem conta?</Text>
                        <Button variant="ghost" onPress={goSignup}>Cadastre-se</Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScreenTransition>
    );
}
