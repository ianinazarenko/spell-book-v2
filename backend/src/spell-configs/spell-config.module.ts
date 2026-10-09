import { Module } from '@nestjs/common';
import { SpellConfigService } from './spell-config.service.js';
import { SpellConfigController } from './spell-config.controller.js';

@Module({
    providers: [SpellConfigService],
    controllers: [SpellConfigController],
    exports: [SpellConfigService],
})
export class SpellConfigModule {}
