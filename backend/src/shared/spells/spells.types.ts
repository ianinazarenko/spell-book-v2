import { EStatus } from './spells.enums.js';
import { SpellJob } from '../../generated/prisma/client.js';

export type SpellItem = Omit<SpellJob, 'status'> & {
    status: EStatus;
};
