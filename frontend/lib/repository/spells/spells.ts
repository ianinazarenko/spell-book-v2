import { BaseAnswer, SpellConfig, SpellItem, SpellStatus } from '@shared/spells/spells.types';
import { fetchData } from '..';
import { getErrorMessage, showError } from '../utils';

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
        const data = await fetchData<SpellItem>({
            route: `${BASE_URL}/create`,
            method: 'POST',
            body,
        });

        return data;
    } catch (e: unknown) {
        showError(e, 'createSpell');
    }
}

export async function deleteSpell(id: string) {
    try {
        return await fetchData<BaseAnswer>({
            method: 'DELETE',
            route: `${BASE_URL}/${id}/delete`,
        });
    } catch (e) {
        showError(e, 'deleteSpell');
        return { success: false, message: getErrorMessage(e) };
    }
}

export async function clearSpells() {
    try {
        return await fetchData<BaseAnswer>({
            method: 'DELETE',
            route: `${BASE_URL}/delete-all`,
        });
    } catch (e) {
        showError(e, 'deleteSpell');
        return { success: false, message: getErrorMessage(e) };
    }
}

export async function castSpells(): Promise<{ status: SpellStatus }> {
    try {
        const newConfig = await fetchData<SpellConfig>({
            method: 'POST',
            route: `${BASE_URL}/cast-all`,
        });

        return { status: newConfig.status };
    } catch (e) {
        showError(e, 'castSpell');
        return { status: 'FAILED' };
    }
}

export async function stopCasting(): Promise<{ status: SpellStatus }> {
    try {
        const newConfig = await fetchData<SpellConfig>({
            method: 'POST',
            route: `${BASE_URL}/stop-all`,
        });

        return { status: newConfig.status };
    } catch (e) {
        showError(e, 'stopCasting');
        return { status: 'FAILED' };
    }
}

export async function saveSpells(): Promise<BaseAnswer> {
    try {
        const result = await fetchData<BaseAnswer>({
            method: 'POST',
            route: `${BASE_URL}/save`,
        });

        return result;
    } catch (e) {
        showError(e, 'saveSpells');
        return { success: false, message: getErrorMessage(e) };
    }
}
