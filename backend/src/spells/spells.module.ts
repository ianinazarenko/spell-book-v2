import { Module } from '@nestjs/common';
import { SpellsService } from './spells.service.js';
import { SpellsController } from './spells.controller.js';

@Module({
    providers: [SpellsService],
    controllers: [SpellsController],
})
export class SpellsModule {}
