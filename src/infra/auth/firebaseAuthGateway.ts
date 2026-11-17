import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type User,
} from 'firebase/auth';

import type { AuthGateway } from '@/src/application/auth/AuthGateway';
import { AuthFailure, type AuthFailureCode } from '@/src/domain/auth/AuthFailure';
import type { AuthUser } from '@/src/domain/auth/AuthUser';
import { auth } from '@/src/services/firebase';

const FIREBASE_CODES: Record<string, AuthFailureCode> = {
    'auth/invalid-api-key': 'invalid-config',
    'auth/configuration-not-found': 'invalid-config',
    'auth/email-already-in-use': 'email-already-in-use',
    'auth/invalid-email': 'invalid-email',
    'auth/weak-password': 'weak-password',
};

function toAuthUser(user: User | null): AuthUser | null {
    if (!user) return null;

    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
    };
}

function toAuthFailure(error: unknown): AuthFailure {
    if (error instanceof AuthFailure) return error;

    const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
    const mapped = FIREBASE_CODES[code];

    if (mapped) return new AuthFailure(mapped);

    return new AuthFailure('unknown', error instanceof Error ? error.message : undefined);
}

function fail(error: unknown): never {
    throw toAuthFailure(error);
}

const listeners = new Set<(user: AuthUser | null) => void>();

function publish(user: User | null) {
    const session = toAuthUser(user);
    listeners.forEach((listener) => listener(session));
}

onAuthStateChanged(auth, publish);

export const firebaseAuthGateway: AuthGateway = {
    getCurrentUser() {
        return toAuthUser(auth.currentUser);
    },

    subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },

    configureGoogleSignIn() {
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        });
    },

    async signInWithEmail(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            fail(error);
        }
    },

    async signUpWithEmail({ name, email, password }) {
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            const displayName = name.trim();

            if (displayName) {
                await updateProfile(credential.user, { displayName });
                publish(credential.user);
            }
        } catch (error) {
            fail(error);
        }
    },

    async signInWithGoogle() {
        try {
            await GoogleSignin.hasPlayServices();

            const response = await GoogleSignin.signIn();
            if (response.type !== 'success') return false;

            const idToken = response.data?.idToken;
            if (!idToken) {
                throw new AuthFailure('missing-token', 'Google não retornou o ID token.');
            }

            await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
            return true;
        } catch (error) {
            fail(error);
        }
    },

    async signOut() {
        try {
            await signOut(auth);
        } catch (error) {
            fail(error);
        }
    },
};
