import { EStatus } from './spells.enums.js';

export interface ISpellItem {
    id: string;
    spell: string;
    duration: number;
    iterationsCompleted: number;
    status: EStatus;
    createdAt: string;
}
