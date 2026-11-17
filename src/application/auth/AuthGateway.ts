import type { AuthUser } from '@/src/domain/auth/AuthUser';

export interface SignUpCredentials {
    name: string;
    email: string;
    password: string;
}

/** Porta de autenticação. A implementação concreta fica na infraestrutura. */
export interface AuthGateway {
    getCurrentUser(): AuthUser | null;
    subscribe(listener: (user: AuthUser | null) => void): () => void;
    configureGoogleSignIn(): void;
    signInWithEmail(email: string, password: string): Promise<void>;
    signUpWithEmail(credentials: SignUpCredentials): Promise<void>;
    /** `false` quando a pessoa cancela o fluxo do Google. */
    signInWithGoogle(): Promise<boolean>;
    signOut(): Promise<void>;
}
