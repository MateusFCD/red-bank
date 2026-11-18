import type { AuthGateway, SignUpCredentials } from '@/src/application/auth/AuthGateway';
import type { AuthActionResult } from '@/src/application/auth/AuthResult';
import { signUpMessage } from '@/src/domain/auth/authMessages';

export async function signUpWithEmail(
    gateway: AuthGateway,
    credentials: SignUpCredentials,
): Promise<AuthActionResult> {
    try {
        await gateway.signUpWithEmail({
            name: credentials.name.trim(),
            email: credentials.email.trim(),
            password: credentials.password,
        });
        return { ok: true };
    } catch (error) {
        return { ok: false, message: signUpMessage(error) };
    }
}
