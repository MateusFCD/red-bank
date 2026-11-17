import { gcm } from '@noble/ciphers/aes.js';
import { bytesToHex, bytesToUtf8, hexToBytes, utf8ToBytes } from '@noble/ciphers/utils.js';
import { getRandomBytes } from 'expo-crypto';
import { Platform } from 'react-native';

type AsyncStorageModule = typeof import('@react-native-async-storage/async-storage').default;
type SecureStoreModule = typeof import('expo-secure-store');

/**
 * Cache local criptografado com AES-256-GCM.
 *
 * - O conteúdo cifrado fica no AsyncStorage.
 * - A chave (256 bits, uma por usuário) fica no Keychain (iOS) / Keystore (Android)
 *   via expo-secure-store, sem backup em nuvem e acessível só com o aparelho desbloqueado.
 * - O GCM autentica os dados: qualquer alteração no conteúdo salvo faz a leitura falhar.
 * - O namespace e o uid entram como AAD, então o cache de um usuário não pode ser
 *   copiado para o "slot" de outro.
 *
 * Na web não há armazenamento seguro para a chave, então o cache fica desativado.
 * Se os módulos nativos não estiverem no binário (build antigo), o cache também se
 * desativa em vez de derrubar o app: ele é uma otimização, não um requisito.
 */

const KEY_BYTES = 32; // AES-256
const NONCE_BYTES = 12; // tamanho recomendado para GCM
const FORMAT_VERSION = 1;

interface Backends {
    storage: AsyncStorageModule;
    secureStore: SecureStoreModule;
    secureOptions: import('expo-secure-store').SecureStoreOptions;
}

let backends: Backends | null | undefined;

/**
 * Carrega os módulos nativos sob demanda. O AsyncStorage lança erro já no import
 * quando o módulo nativo não existe, por isso o `require` fica dentro do try.
 */
function getBackends(): Backends | null {
    if (backends !== undefined) return backends;

    if (Platform.OS === 'web') {
        backends = null;
        return backends;
    }

    try {
        const storage: AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
        const secureStore: SecureStoreModule = require('expo-secure-store');

        backends = {
            storage,
            secureStore,
            secureOptions: { keychainAccessible: secureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY },
        };
    } catch (error) {
        if (__DEV__) {
            console.warn(
                'Cache criptografado desativado: módulos nativos ausentes. Recompile o app (npx expo run:android).',
                error,
            );
        }
        backends = null;
    }

    return backends;
}

interface StoredPayload {
    v: number;
    n: string; // nonce (hex)
    c: string; // ciphertext + tag (hex)
}

interface CacheEnvelope<T> {
    savedAt: number;
    data: T;
}

const keyName = (uid: string) => `redbank_cache_key_${uid}`;
const entryName = (namespace: string, uid: string) => `@redbank/cache/${namespace}/${uid}`;
const aadFor = (namespace: string, uid: string) => utf8ToBytes(`redbank:${namespace}:${uid}`);

// Evita gerar duas chaves diferentes se duas leituras/escritas começarem ao mesmo tempo.
const keyRequests = new Map<string, Promise<Uint8Array>>();

function getOrCreateKey({ secureStore, secureOptions }: Backends, uid: string): Promise<Uint8Array> {
    const pending = keyRequests.get(uid);
    if (pending) return pending;

    const request = (async () => {
        const stored = await secureStore.getItemAsync(keyName(uid), secureOptions);
        if (stored) return hexToBytes(stored);

        const key = getRandomBytes(KEY_BYTES);
        await secureStore.setItemAsync(keyName(uid), bytesToHex(key), secureOptions);
        return key;
    })();

    keyRequests.set(uid, request);
    request.catch(() => keyRequests.delete(uid));

    return request;
}

export async function writeEncrypted<T>(namespace: string, uid: string, data: T): Promise<void> {
    const backend = getBackends();
    if (!backend) return;

    const key = await getOrCreateKey(backend, uid);
    const nonce = getRandomBytes(NONCE_BYTES);
    const envelope: CacheEnvelope<T> = { savedAt: Date.now(), data };

    const ciphertext = gcm(key, nonce, aadFor(namespace, uid)).encrypt(
        utf8ToBytes(JSON.stringify(envelope)),
    );

    const payload: StoredPayload = {
        v: FORMAT_VERSION,
        n: bytesToHex(nonce),
        c: bytesToHex(ciphertext),
    };

    await backend.storage.setItem(entryName(namespace, uid), JSON.stringify(payload));
}

/**
 * Lê e descriptografa uma entrada. Retorna `null` se não existir, estiver expirada
 * ou não puder ser autenticada (dados adulterados ou chave perdida); nesses casos
 * a entrada é apagada.
 */
export async function readEncrypted<T>(
    namespace: string,
    uid: string,
    maxAgeMs: number,
): Promise<T | null> {
    const backend = getBackends();
    if (!backend) return null;

    const raw = await backend.storage.getItem(entryName(namespace, uid));
    if (!raw) return null;

    try {
        const payload = JSON.parse(raw) as StoredPayload;
        if (payload.v !== FORMAT_VERSION) throw new Error('Formato de cache desconhecido.');

        const key = await getOrCreateKey(backend, uid);
        const plaintext = gcm(key, hexToBytes(payload.n), aadFor(namespace, uid)).decrypt(
            hexToBytes(payload.c),
        );

        const envelope = JSON.parse(bytesToUtf8(plaintext)) as CacheEnvelope<T>;
        if (Date.now() - envelope.savedAt > maxAgeMs) throw new Error('Cache expirado.');

        return envelope.data;
    } catch {
        await backend.storage.removeItem(entryName(namespace, uid));
        return null;
    }
}

/**
 * Apaga todo o cache do usuário e a chave dele. Sem a chave, qualquer cópia
 * remanescente do conteúdo cifrado fica ilegível.
 */
export async function clearEncryptedCache(uid: string): Promise<void> {
    const backend = getBackends();
    if (!backend) return;

    keyRequests.delete(uid);

    const prefix = '@redbank/cache/';
    const suffix = `/${uid}`;
    const keys = await backend.storage.getAllKeys();
    const userEntries = keys.filter((key) => key.startsWith(prefix) && key.endsWith(suffix));

    await Promise.all([
        backend.storage.multiRemove(userEntries),
        backend.secureStore.deleteItemAsync(keyName(uid), backend.secureOptions),
    ]);
}
