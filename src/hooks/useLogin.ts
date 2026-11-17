import { useEffect, useState } from 'react';

import {
    configureGoogleSignIn,
    getEmailLoginErrorMessage,
    getGoogleLoginErrorMessage,
    signInWithEmail,
    signInWithGoogle,
} from '@/src/services/auth';

/** Estado e ações do formulário de login. `onSuccess` decide o que fazer após autenticar. */
export function useLogin(onSuccess: () => void) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(configureGoogleSignIn, []);

    async function run(action: () => Promise<boolean>, toMessage: (error: unknown) => string) {
        try {
            setError('');
            setLoading(true);
            if (await action()) onSuccess();
        } catch (err) {
            setError(toMessage(err));
        } finally {
            setLoading(false);
        }
    }

    function loginWithEmail() {
        if (!email.trim() || !password) {
            setError('Informe seu e-mail e sua senha.');
            return;
        }

        return run(async () => {
            await signInWithEmail(email, password);
            return true;
        }, getEmailLoginErrorMessage);
    }

    function loginWithGoogle() {
        return run(signInWithGoogle, getGoogleLoginErrorMessage);
    }

    return { email, setEmail, password, setPassword, error, loading, loginWithEmail, loginWithGoogle };
}
