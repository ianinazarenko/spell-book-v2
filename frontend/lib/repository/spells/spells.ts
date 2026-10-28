import type {
    BaseAnswer,
    SavedSpellItem,
    SpellConfig,
    SpellItem,
    SpellStatus,
} from '@shared/spells/spells.types';

import { getErrorMessage, showError } from '@/lib/repository/utils';

import { fetchData } from '..';

const BASE_URL = '/spells';

export async function loadSpells(): Promise<SpellItem[]> {
    try {
        const data = await fetchData<SpellItem[]>({
            route: '/spells',
        });

        return data ?? [];
    } catch (e) {
        showError(e);
        return [];
    }
}

export async function createSpell(body: { spell: string }): Promise<SpellItem | undefined> {
    try {
        return await fetchData<SpellItem>({
            route: `${BASE_URL}/create`,
            method: 'POST',
            body,
        });
    } catch (e: unknown) {
        showError(e, 'createSpell');
    }
}

export async function deleteSpell(id: string): Promise<BaseAnswer> {
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

export async function clearSpells(): Promise<BaseAnswer> {
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

export async function castSpells(): Promise<Partial<SpellConfig>> {
    try {
        return await fetchData<SpellConfig>({
            method: 'POST',
            route: `${BASE_URL}/cast-all`,
        });
    } catch (e) {
        showError(e, 'castSpell');
        return { status: 'FAILED', errorMessage: getErrorMessage(e) };
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

export async function loadSavedSpells(): Promise<SavedSpellItem[]> {
    try {
        const data = await fetchData<SavedSpellItem[]>({
            method: 'GET',
            route: `${BASE_URL}/saved`,
        });

        return data ?? [];
    } catch (e) {
        showError(e, 'getSavedSpells');
        return [];
    }
}

export async function saveSpells(): Promise<SavedSpellItem[]> {
    try {
        const data = await fetchData<SavedSpellItem[]>({
            method: 'POST',
            route: `${BASE_URL}/save`,
        });

        return data ?? [];
    } catch (e) {
        showError(e, 'saveSpells');
        return [];
    }
}

export async function restoreSpells(): Promise<SpellItem[]> {
    try {
        const data = await fetchData<SpellItem[]>({
            method: 'POST',
            route: `${BASE_URL}/restore`,
        });

        return data ?? [];
    } catch (e) {
        showError(e, 'restoreSpells');
        return [];
    }
}
