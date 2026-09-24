import { SpellItem } from '@shared/spells/spells.types';
import { fetchData } from '..';
import { showError } from '../utils';

const BASE_URL = '/spells';

export async function loadSpells(): Promise<SpellItem[] | undefined> {
    try {
        const data = await fetchData<SpellItem[]>({
            route: '/spells',
        });

        return data;
    } catch (e) {
        showError(e);
    }
}

export async function createSpell(body: { spell: string }): Promise<SpellItem | undefined> {
    try {
        const data = fetchData<SpellItem>({
            route: `${BASE_URL}/create`,
            method: 'POST',
            body,
        });

        return data;
    } catch (e: unknown) {
        showError(e, 'createSpell');
    }
}
