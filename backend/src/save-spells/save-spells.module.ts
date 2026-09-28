import { Module } from '@nestjs/common';
import { SaveSpellsService } from './save-spells.service.js';
import { SaveSpellsController } from './save-spells.controller.js';

@Module({
    providers: [SaveSpellsService],
    controllers: [SaveSpellsController],
})
export class SaveSpellsModule {}
