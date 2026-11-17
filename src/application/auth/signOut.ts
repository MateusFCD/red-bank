import type { AuthGateway } from '@/src/application/auth/AuthGateway';

export function signOut(gateway: AuthGateway): Promise<void> {
    return gateway.signOut();
}
