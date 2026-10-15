import { SpellJob, SpellConfig, PushSubscription } from '../../generated/prisma/client.js';

export type { SpellConfig };
export type SpellItem = SpellJob;
export type SpellStatus = SpellConfig['status'];
export type SavedSpellItem = Pick<SpellItem, 'id' | 'spellText'>;

export interface BaseAnswer {
    message: string;
    success: boolean;
}

export interface StatusAnswer {
    count: number;
    status: SpellStatus;
}

export type Subscription = PushSubscription;
