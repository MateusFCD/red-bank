import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { FormField } from '@/src/components/FormField';
import { Input } from '@/src/components/Input';
import { ChevronLeftIcon } from '@/src/components/icons';
import { ScreenTransition } from '@/src/components/ScreenTransition';
import { useSignup } from '@/src/hooks/useSignup';
import { colors } from '@/src/theme/colors';
import { StackNavigationRoutes } from "@/src/routes/App.routes";

export function SignupScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigationRoutes>>();

    const goLogin = () => {
        navigation.navigate('Login');
    };
    const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'Bottom' }] });

    const {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        loading,
        signup,
    } = useSignup(goHome);

    return (
        <ScreenTransition className="bg-app">
            <KeyboardAvoidingView className="flex-1" behavior={ Platform.OS === 'ios' ? 'padding' : undefined }>
                <ScrollView
                    contentContainerClassName="grow"
                    showsVerticalScrollIndicator={ false }
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        className="grow px-[26px] pb-[30px] bg-app"
                        style={ { paddingTop: insets.top + 40 } }
                    >
                        <Pressable className="w-8 h-8 items-center justify-center mb-[18px]" onPress={ goLogin } hitSlop={ 8 }>
                            <ChevronLeftIcon size={ 19 } color={ colors.text }/>
                        </Pressable>

                        <Text className="font-heading text-[26px] text-ink mb-1.5">Criar conta</Text>
                        <Text className="text-[13px] text-ink/60 mb-7 font-body">Leva menos de um minuto</Text>

                        <View className="gap-3.5">
                            <FormField label="Nome">
                                <Input
                                    placeholder="Seu nome completo"
                                    autoCapitalize="words"
                                    autoComplete="name"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </FormField>

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
                                    placeholder="Mínimo 6 caracteres"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </FormField>

                            <FormField label="Confirmar senha">
                                <Input
                                    placeholder="Repita a senha"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </FormField>

                            <Button
                                variant="primary"
                                block
                                className="mt-1.5"
                                onPress={signup}
                                loading={loading}
                            >
                                Criar conta
                            </Button>

                            {error ? (
                                <View className="bg-brand/14 rounded-[10px] py-[9px] px-3">
                                    <Text className="text-brand-300 text-[12.5px] font-body">{error}</Text>
                                </View>
                            ) : null}
                        </View>

                        <View className="flex-row justify-center items-center gap-0.5 mt-[22px]">
                            <Text className="text-[13px] text-ink font-body">Já tem conta?</Text>
                            <Button variant="ghost" onPress={ goLogin }>
                                Entrar
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenTransition>
    );
}
