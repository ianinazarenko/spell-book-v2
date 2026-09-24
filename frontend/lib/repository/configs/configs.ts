import { SpellConfig } from '@shared/spells/spells.types';
import { fetchData } from '..';
import { showError } from '../utils';

const BASE_URL = '/config';

export async function loadConfigs(): Promise<SpellConfig | undefined> {
    try {
        const data = await fetchData<SpellConfig>({
            route: BASE_URL,
        });

        return data;
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
