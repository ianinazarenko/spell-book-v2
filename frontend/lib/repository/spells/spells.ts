import { SpellItem } from '@shared/spells/spells.types';
import { fetchData } from '..';
import { showError } from '../utils';

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
