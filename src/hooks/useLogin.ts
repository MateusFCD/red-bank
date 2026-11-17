import { useEffect, useState } from 'react';

import { prepareGoogleSignIn, signInWithEmail, signInWithGoogle } from '@/src/composition/auth';
import { validateLogin } from '@/src/domain/auth/validateAuth';

/** Estado e ações do formulário de login. `onSuccess` decide o que fazer após autenticar. */
export function useLogin(onSuccess: () => void) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(prepareGoogleSignIn, []);

    async function loginWithEmail() {
        const validation = validateLogin(email, password);
        if (validation) {
            setError(validation);
            return;
        }

        try {
            setError('');
            setLoading(true);

            const result = await signInWithEmail(email, password);
            if (result.ok) onSuccess();
            else setError(result.message);
        } finally {
            setLoading(false);
        }
    }

    async function loginWithGoogle() {
        try {
            setError('');
            setLoading(true);

            const result = await signInWithGoogle();
            if (result.ok) onSuccess();
            else if (!result.cancelled) setError(result.message);
        } finally {
            setLoading(false);
        }
    }

    return { email, setEmail, password, setPassword, error, loading, loginWithEmail, loginWithGoogle };
}
