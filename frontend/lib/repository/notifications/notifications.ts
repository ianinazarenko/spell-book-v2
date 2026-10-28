import type { Subscription } from '@shared/spells/spells.types';

import { fetchData } from '@/lib/repository';

const BASE_URL = '/notifications';

export async function subscribe(body: PushSubscription): Promise<void> {
    try {
        await fetchData<Subscription>({
            route: `${BASE_URL}/subscribe`,
            method: 'POST',
            body,
        });
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function unsubscribe(body: { endpoint: PushSubscription['endpoint'] }): Promise<void> {
    try {
        await fetchData<undefined>({
            route: `${BASE_URL}/unsubscribe`,
            method: 'DELETE',
            body,
        });
    } catch (err) {
        console.error(err);
        throw err;
    }
}
