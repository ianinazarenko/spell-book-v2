'use client';

import { useRef, useCallback, useSyncExternalStore } from 'react';

type TStorage = 'localStorage' | 'sessionStorage';
type TStateValue<T> = T | ((prevVal: T) => T);
type TSubscribe = (callback: () => void) => () => void;
type TStorageSnapshot<T> = {
    raw: string;
    value: T;
};

const storageCache = new Map<string, unknown>();

function createStorageEventName(key: string): string {
    return `storage:${key}`;
}

function getBrowserStorage(key: TStorage): Storage {
    return key === 'localStorage' ? window.localStorage : window.sessionStorage;
}

function readStorage<T>(type: TStorage, key: string, initialValue: T): T {
    const cacheKey = `${type}:${key}`;

    try {
        const saved = getBrowserStorage(type).getItem(key);

        if (saved === null) {
            storageCache.delete(cacheKey);
            return initialValue;
        }

        const cached = storageCache.get(cacheKey);

        if (cached && typeof cached === 'object' && 'raw' in cached && 'value' in cached) {
            const snapshot = cached as TStorageSnapshot<T>;

            if (snapshot.raw === saved) {
                return snapshot.value;
            }
        }

        const value = JSON.parse(saved) as T;
        storageCache.set(cacheKey, { raw: saved, value });

        return value;
    } catch (err) {
        console.warn(`Error reading from ${type}:`, err);
        return initialValue;
    }
}

function writeStorage<T>(type: TStorage, key: string, value: T): void {
    try {
        getBrowserStorage(type).setItem(key, JSON.stringify(value));
        window.dispatchEvent(new Event(createStorageEventName(key)));
    } catch (err) {
        console.warn(`Error writing to ${type}:`, err);
    }
}

/**
 * Универсальный хук для работы с браузерным хранилищем.
 * Исправлен для предотвращения ошибок гидратации в Next.js.
 */
function useStorage<T>(
    type: TStorage,
    key: string,
    initialValue: T
): [T, (val: TStateValue<T>) => void] {
    const initialValueRef = useRef(initialValue);

    const subscribe: TSubscribe = useCallback(
        (callback: () => void) => {
            const eventName = createStorageEventName(key);

            window.addEventListener(eventName, callback);
            window.addEventListener('storage', callback);

            return () => {
                window.removeEventListener(eventName, callback);
                window.removeEventListener('storage', callback);
            };
        },
        [key]
    );

    const getSnapshot = useCallback(
        () => readStorage(type, key, initialValueRef.current),
        [type, key]
    );

    const getServerSnapshot = useCallback(() => initialValueRef.current, []);

    const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const setValue = useCallback(
        (nextValue: TStateValue<T>): void => {
            const resolvedValue =
                nextValue instanceof Function
                    ? nextValue(readStorage(type, key, initialValueRef.current))
                    : nextValue;

            writeStorage(type, key, resolvedValue);
        },
        [type, key]
    );

    return [value, setValue];
}

export function useLocalStorage<T>(key: string, initialValue: T) {
    return useStorage<T>('localStorage', key, initialValue);
}

// export function useSessionStorage<T>(key: string, initialValue: T) {
//     return useStorage<T>('sessionStorage', key, initialValue);
// }
