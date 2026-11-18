export type AuthFailureCode =
    | 'invalid-config'
    | 'email-already-in-use'
    | 'invalid-email'
    | 'weak-password'
    | 'missing-token'
    | 'unknown';

export class AuthFailure extends Error {
    readonly code: AuthFailureCode;

    constructor(code: AuthFailureCode, message?: string) {
        super(message);
        this.name = 'AuthFailure';
        this.code = code;
    }
}
