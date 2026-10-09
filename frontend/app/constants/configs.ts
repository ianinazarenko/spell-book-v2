import { SpellConfig } from '../../../backend/src/generated/prisma/client';
import { underline } from 'next/dist/lib/picocolors';

const DEFAULT_CONFIG_ID = 'spell-config';

export const DEFAULT_CONFIGS: SpellConfig = {
    id: DEFAULT_CONFIG_ID,
    iterationsTotal: 1800,
    iterationsCompleted: 0,
    durationMin: 60,
    status: 'QUEUED',
    runId: null,
    updatedAt: null,
    errorMessage: null,
};
