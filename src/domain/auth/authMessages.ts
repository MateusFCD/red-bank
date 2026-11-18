import { AuthFailure } from '@/src/domain/auth/AuthFailure';

export function emailLoginMessage(error: unknown): string {
    if (error instanceof AuthFailure && error.code === 'invalid-config') {
        return 'A configuração do Firebase está inválida. Confira o arquivo .env.';
    }

    return 'E-mail ou senha inválidos.';
}

export function googleLoginMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return 'Não foi possível entrar com o Google.';
}

export function signUpMessage(error: unknown): string {
    if (error instanceof AuthFailure) {
        if (error.code === 'email-already-in-use') {
            return 'Esse e-mail já está cadastrado.';
        }

        if (error.code === 'invalid-email') {
            return 'Informe um e-mail válido.';
        }

        if (error.code === 'weak-password') {
            return 'A senha precisa ter pelo menos 6 caracteres.';
        }

        if (error.code === 'invalid-config') {
            return 'A configuração do Firebase está inválida. Confira o arquivo .env.';
        }
    }

    return 'Não foi possível criar a conta.';
}
