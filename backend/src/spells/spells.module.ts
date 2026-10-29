import { Module } from '@nestjs/common';
import { SpellsService } from './spells.service.js';
import { SpellsController } from './spells.controller.js';
import { SSEModule } from '../sse/sse.module.js';

@Module({
    providers: [SpellsService],
    controllers: [SpellsController],
    imports: [SSEModule],
})
export class SpellsModule {}
