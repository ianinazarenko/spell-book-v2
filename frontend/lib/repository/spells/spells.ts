import {
    BaseAnswer,
    SavedSpellItem,
    SpellConfig,
    SpellItem,
    SpellStatus,
} from '@shared/spells/spells.types';
import { fetchData } from '..';
import { getErrorMessage, showError } from '../utils';
import { SpellJob } from '../../../../backend/src/generated/prisma/client';

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

export async function castSpells(): Promise<{ status: SpellStatus; errorMessage: string | null }> {
    try {
        const newConfig = await fetchData<SpellConfig>({
            method: 'POST',
            route: `${BASE_URL}/cast-all`,
        });

        return { status: newConfig.status, errorMessage: newConfig.errorMessage };
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

export async function restoreSpells(): Promise<SpellJob[]> {
    try {
        const data = await fetchData<SpellJob[]>({
            method: 'POST',
            route: `${BASE_URL}/restore`,
        });

        return data ?? [];
    } catch (e) {
        showError(e, 'restoreSpells');
        return [];
    }
}
