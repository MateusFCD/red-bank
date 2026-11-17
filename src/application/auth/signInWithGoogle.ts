import type { AuthGateway } from '@/src/application/auth/AuthGateway';
import type { GoogleSignInResult } from '@/src/application/auth/AuthResult';
import { googleLoginMessage } from '@/src/domain/auth/authMessages';

export async function signInWithGoogle(gateway: AuthGateway): Promise<GoogleSignInResult> {
    try {
        const signedIn = await gateway.signInWithGoogle();
        if (!signedIn) return { ok: false, cancelled: true };
        return { ok: true };
    } catch (error) {
        return { ok: false, cancelled: false, message: googleLoginMessage(error) };
    }
}
