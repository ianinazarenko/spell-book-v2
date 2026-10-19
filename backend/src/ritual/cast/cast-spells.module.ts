import { Module } from '@nestjs/common';
import { CastSpellsService } from './cast-spells.service.js';
import { CastSpellController } from './cast-spells.controller.js';
import { NotificationsService } from '../../notifications/notifications.service.js';

@Module({
    providers: [CastSpellsService, NotificationsService],
    controllers: [CastSpellController],
})
export class CastSpellsModule {}
