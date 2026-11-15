import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut,
    type User,
} from 'firebase/auth';

import { auth } from './firebase';

export function configureGoogleSignIn() {
    GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
}

export function subscribeToAuthChanges(listener: (user: User | null) => void) {
    return onAuthStateChanged(auth, listener);
}

export function getCurrentUser(): User | null {
    return auth.currentUser;
}

export async function signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email.trim(), password);
}

/** Retorna `false` quando o usuário cancela o fluxo do Google. */
export async function signInWithGoogle(): Promise<boolean> {
    await GoogleSignin.hasPlayServices();

    const response = await GoogleSignin.signIn();
    if (response.type !== 'success') return false;

    const idToken = response.data?.idToken;
    if (!idToken) throw new Error('Google não retornou o ID token.');

    await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
    return true;
}

export async function signOutUser() {
    await signOut(auth);
}

export function getEmailLoginErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'code' in error) {
        const code = String(error.code);

        if (code === 'auth/invalid-api-key' || code === 'auth/configuration-not-found') {
            return 'A configuração do Firebase está inválida. Confira o arquivo .env.';
        }
    }

    return 'E-mail ou senha inválidos.';
}

export function getGoogleLoginErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Não foi possível entrar com o Google.';
}
