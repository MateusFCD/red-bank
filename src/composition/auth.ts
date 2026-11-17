import { signInWithEmail as signInWithEmailUseCase } from '@/src/application/auth/signInWithEmail';
import { signInWithGoogle as signInWithGoogleUseCase } from '@/src/application/auth/signInWithGoogle';
import { signOut as signOutUseCase } from '@/src/application/auth/signOut';
import { signUpWithEmail as signUpWithEmailUseCase } from '@/src/application/auth/signUpWithEmail';
import type { SignUpCredentials } from '@/src/application/auth/AuthGateway';
import { firebaseAuthGateway } from '@/src/infra/auth/firebaseAuthGateway';

const gateway = firebaseAuthGateway;

export function getCurrentSession() {
    return gateway.getCurrentUser();
}

export function subscribeToSession(listener: Parameters<typeof gateway.subscribe>[0]) {
    return gateway.subscribe(listener);
}

export function prepareGoogleSignIn() {
    gateway.configureGoogleSignIn();
}

export function signInWithEmail(email: string, password: string) {
    return signInWithEmailUseCase(gateway, email, password);
}

export function signInWithGoogle() {
    return signInWithGoogleUseCase(gateway);
}

export function signUpWithEmail(credentials: SignUpCredentials) {
    return signUpWithEmailUseCase(gateway, credentials);
}

export function signOut() {
    return signOutUseCase(gateway);
}
