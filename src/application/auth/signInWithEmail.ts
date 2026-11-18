import type { AuthGateway } from '@/src/application/auth/AuthGateway';
import type { AuthActionResult } from '@/src/application/auth/AuthResult';
import { emailLoginMessage } from '@/src/domain/auth/authMessages';

export async function signInWithEmail(
    gateway: AuthGateway,
    email: string,
    password: string,
): Promise<AuthActionResult> {
    try {
        await gateway.signInWithEmail(email.trim(), password);
        return { ok: true };
    } catch (error) {
        return { ok: false, message: emailLoginMessage(error) };
    }
}
