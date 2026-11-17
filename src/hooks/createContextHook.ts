import { useContext, type Context } from 'react';

/** Cria um hook que lê o contexto e falha cedo se o provider estiver ausente. */
export function createContextHook<T>(context: Context<T | null>, name: string) {
    return function useRequiredContext(): T {
        const value = useContext(context);

        if (!value) {
            throw new Error(`${name} must be used within its provider.`);
        }

        return value;
    };
}
