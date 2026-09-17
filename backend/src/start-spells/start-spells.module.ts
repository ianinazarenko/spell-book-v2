import { Module } from '@nestjs/common';
import { StartSpellsService } from './start-spells.service.js';
import { StartSpellController } from './start-spells.controller.js';

@Module({
    providers: [StartSpellsService],
    controllers: [StartSpellController],
})
export class StartSpellsModule {}
