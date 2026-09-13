import { Injectable } from '@nestjs/common';
import { CreateSpellDto } from './spells/create-spell.dto.js';
import { ISpellJob } from './spells/spell.types.js';
import { EStatus } from './spells/spell.enum.js';

@Injectable()
export class AppService {
    // TODO: temparary storage
    private jobs: ISpellJob[] = [];

    getHello(): string {
        return 'Hello World!';
    }

    getHealth(): { status: string; timestamp: string } {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }

    createSpell(dto: CreateSpellDto): ISpellJob {
        const newJob: ISpellJob = {
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
