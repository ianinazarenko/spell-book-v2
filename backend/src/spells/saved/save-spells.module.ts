import { Module } from '@nestjs/common';
import { SaveSpellsService } from './save-spells.service.js';
import { SaveSpellsController } from './save-spells.controller.js';
import { SSEModule } from '../../sse/sse.module.js';

@Module({
    providers: [SaveSpellsService],
    controllers: [SaveSpellsController],
    imports: [SSEModule],
})
export class SaveSpellsModule {}
