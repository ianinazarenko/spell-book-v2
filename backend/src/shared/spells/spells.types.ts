import { SpellJob, SpellConfig } from '../../generated/prisma/client.js';

export type SpellItem = SpellJob;
export type SpellStatus = SpellJob['status'];
export type { SpellConfig };
