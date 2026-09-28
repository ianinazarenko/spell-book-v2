import { FetchParams } from './types';
import { baseUrl } from './constants';
import { getParamsString, getBodyString } from './utils';

export async function fetchData<T>({
    route = '',
    method = 'GET',
    query = null,
    body = null,
    errorMessage = '[fetchData] request failed',
}: FetchParams): Promise<T | never> {
    const params = getParamsString(query);

    try {
        const res = await fetch(`${baseUrl}${route}${params}`, {
            method,
            body: getBodyString(body),
            headers: body ? { 'Content-Type': 'application/json' } : undefined,
        });

        const data = (await res.json()) as T;

        if (!res.ok) {
            const message =
                typeof data === 'object' &&
                data !== null &&
                'message' in data &&
                typeof data.message === 'string'
                    ? data.message
                    : errorMessage;

            throw new Error(`${message}; response status: ${res.status}`);
        }

        return data;
    } catch (e) {
        throw e;
    }
}
