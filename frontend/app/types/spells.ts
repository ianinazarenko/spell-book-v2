export enum EStatus {
    Accepted = 'accepted',
    Running = 'running',
    Completed = 'completed',
}

export interface ISpellJob {
    id: string;
    spell: string;
    duration: number;
    iterationsCompleted: number;
    status: EStatus;
    createdAt: string;
}
