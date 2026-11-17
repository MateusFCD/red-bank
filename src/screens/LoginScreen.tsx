import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { FormField } from '@/src/components/FormField';
import { Input } from '@/src/components/Input';
import { ScreenTransition } from '@/src/components/ScreenTransition';
import { useLogin } from '@/src/hooks/useLogin';
import type { StackNavigationRoutes } from '@/src/routes/App.routes';

export function LoginScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();

    const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'Bottom' }] });
    const goSignup = () => navigation.navigate('SignUp');

    const { email, setEmail, password, setPassword, error, loading, loginWithEmail, loginWithGoogle } =
        useLogin(goHome);

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
                            onPress={loginWithEmail}
                            loading={loading}
                        >
                            Entrar
                        </Button>

                        <Button
                            variant="secondary"
                            block
                            onPress={loginWithGoogle}
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
