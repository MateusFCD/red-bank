import { useState } from 'react';

import { signUpWithEmail } from '@/src/composition/auth';
import { validateSignUp } from '@/src/domain/auth/validateAuth';

/** Estado e ação do formulário de cadastro. `onSuccess` decide o que fazer após criar a conta. */
export function useSignup(onSuccess: () => void) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function signup() {
        const validation = validateSignUp({ name, email, password, confirmPassword });
        if (validation) {
            setError(validation);
            return;
        }

        try {
            setError('');
            setLoading(true);

            const result = await signUpWithEmail({ name, email, password });
            if (result.ok) onSuccess();
            else setError(result.message);
        } finally {
            setLoading(false);
        }
    }

    return {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        loading,
        signup,
    };
}
