import { QueryParams, BodyObj } from './types';

export function getParamsString(query: QueryParams): string {
    return query ? '?' + new URLSearchParams(query).toString() : '';
}

export function getBodyString(body: BodyObj): string | null {
    return body ? JSON.stringify(body) : null;
}

export function showError(e: unknown, source: string = ''): void {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.warn(`${source} ${message}`.trim());
}
