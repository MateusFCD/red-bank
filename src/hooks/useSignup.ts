import { useState } from 'react';

import { getSignupErrorMessage, signUpWithEmail } from '@/src/services/auth';

export function useSignup(onSuccess: () => void) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function signup() {
        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError('Preencha nome, e-mail e senha.');
            return;
        }

        if (password.length < 6) {
            setError('A senha precisa ter pelo menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        try {
            setError('');
            setLoading(true);
            await signUpWithEmail(name, email, password);
            onSuccess();
        } catch (err) {
            setError(getSignupErrorMessage(err));
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
