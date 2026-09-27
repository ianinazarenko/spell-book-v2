import { Module } from '@nestjs/common';
import { CastSpellsService } from './cast-spells.service.js';
import { CastSpellController } from './cast-spells.controller.js';

@Module({
    providers: [CastSpellsService],
    controllers: [CastSpellController],
})
export class CastSpellsModule {}
