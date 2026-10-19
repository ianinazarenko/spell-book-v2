import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';

@Module({
    providers: [NotificationsService],
    controllers: [NotificationsController],
})
export class NotificationsModule {}
