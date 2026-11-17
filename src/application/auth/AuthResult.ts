export type AuthActionResult = { ok: true } | { ok: false; message: string };

export type GoogleSignInResult =
    | { ok: true }
    | { ok: false; cancelled: true }
    | { ok: false; cancelled: false; message: string };
