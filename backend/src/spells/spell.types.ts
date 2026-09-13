import { EStatus } from './spell.enum.js';

export interface ISpellJob {
    id: string;
    spell: string;
    duration: number;
    iterationsCompleted: number;
    status: EStatus;
    createdAt: string;
}
