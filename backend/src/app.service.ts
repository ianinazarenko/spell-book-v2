import { Injectable } from '@nestjs/common';
import { CreateSpellDto } from './spells/create-spell.dto.js';
import { EStatus } from './shared/spells/spells.enums.js';
import type { ISpellItem } from './shared/spells/spells.types.js';

@Injectable()
export class AppService {
    // TODO: temparary storage
    private jobs: ISpellItem[] = [];

    getHello(): string {
        return 'Hello World!';
    }

    getHealth(): { status: string; timestamp: string } {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }

    createSpell(dto: CreateSpellDto): ISpellItem {
        const newJob: ISpellItem = {
            id: Date.now().toString(), // TODO: temporary
            spell: dto.spell,
            duration: dto.duration,
            iterationsCompleted: 0,
            status: EStatus.Accepted,
            createdAt: new Date().toISOString(),
        };

        this.jobs.push(newJob);
        return newJob;
    }
}
