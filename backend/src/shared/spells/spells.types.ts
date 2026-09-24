import { SpellJob, SpellConfig } from '../../generated/prisma/client.js';

export type SpellItem = SpellJob;
export type SpellStatus = SpellConfig['status'];
export type { SpellConfig };
