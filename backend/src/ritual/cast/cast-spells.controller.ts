import { Controller, HttpCode, HttpStatus, Post, Sse, MessageEvent } from '@nestjs/common';
import { CastSpellsService } from './cast-spells.service.js';
import { SpellConfig } from '../../generated/prisma/client.js';
import { Observable, map } from 'rxjs';

@Controller('spells')
export class CastSpellController {
    constructor(private readonly castSpellsService: CastSpellsService) {}

    @Post('/cast-all')
    @HttpCode(HttpStatus.ACCEPTED)
    castAllSpellsJob(): Promise<SpellConfig> {
        return this.castSpellsService.castAllSpellsJob();
    }

    @Post('/stop-all')
    @HttpCode(HttpStatus.OK)
    stopAllSpellsJob(): Promise<SpellConfig> {
        return this.castSpellsService.stopAllSpellsJob();
    }

    @Sse('/progress')
    streamRitualProgress(): Observable<MessageEvent> {
        return this.castSpellsService.getProgressStream().pipe(
            map((config) => ({
                data: config,
                retry: 5000,
            }))
        );
    }
}
