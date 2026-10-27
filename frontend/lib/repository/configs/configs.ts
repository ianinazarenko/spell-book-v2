import type { SpellConfig, StatusAnswer } from '@shared/spells/spells.types';

import { showError } from '@/lib/repository/utils';

import { fetchData } from '..';

const BASE_URL = '/config';

export async function loadConfigs(): Promise<SpellConfig | undefined> {
    try {
        return await fetchData<SpellConfig>({
            route: BASE_URL,
        });
    } catch (e) {
        showError(e, 'loadConfigs');
    }
}

export async function updateConfigs(body: {
    iterationsTotal: number;
    durationMin: number | null;
}): Promise<SpellConfig | undefined> {
    if (!body.iterationsTotal) {
        throw new Error('There should be iterations total count');
    }

    try {
        return await fetchData<SpellConfig>({
            route: `${BASE_URL}/update`,
            method: 'POST',
            body,
        });
    } catch (e) {
        showError(e, 'updateConfigs');
    }
}

export async function clearCount(): Promise<SpellConfig | undefined> {
    try {
        return await fetchData<SpellConfig>({
            method: 'POST',
            route: `${BASE_URL}/clear-count`,
        });
    } catch (e) {
        showError(e, 'clearCount');
    }
}

export async function getCount(): Promise<StatusAnswer> {
    try {
        return await fetchData<StatusAnswer>({
            method: 'GET',
            route: `${BASE_URL}/count`,
        });
    } catch (e) {
        showError(e, 'getCount');
        return {
            count: 0,
            status: 'FAILED',
        };
    }
}
