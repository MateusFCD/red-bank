export interface SignUpForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export function validateLogin(email: string, password: string): string | null {
    if (!email.trim() || !password) {
        return 'Informe seu e-mail e sua senha.';
    }

    return null;
}

export function validateSignUp(form: SignUpForm): string | null {
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
        return 'Preencha nome, e-mail e senha.';
    }

    if (form.password.length < 6) {
        return 'A senha precisa ter pelo menos 6 caracteres.';
    }

    if (form.password !== form.confirmPassword) {
        return 'As senhas não coincidem.';
    }

    return null;
}
