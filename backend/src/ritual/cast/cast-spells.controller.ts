import { Controller, HttpCode, HttpStatus, Post, Sse, MessageEvent } from '@nestjs/common';
import { CastSpellsService } from './cast-spells.service.js';
import { SpellConfig } from '../../generated/prisma/client.js';

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
}
