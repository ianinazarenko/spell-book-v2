import { Module } from '@nestjs/common';
import { CastSpellsService } from './cast-spells.service.js';
import { CastSpellController } from './cast-spells.controller.js';
import { NotificationsModule } from '../../notifications/notifications.module.js';

@Module({
    providers: [CastSpellsService],
    controllers: [CastSpellController],
    imports: [NotificationsModule],
})
export class CastSpellsModule {}
