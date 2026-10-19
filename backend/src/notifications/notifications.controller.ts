import { Body, Controller, Delete, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { SubscriptionDto } from './subscription.dto.js';
import { Subscription } from '../shared/spells/spells.types.js';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post('/subscribe')
    @HttpCode(HttpStatus.OK)
    async subscribe(@Body() dto: SubscriptionDto): Promise<Subscription> {
        return this.notificationsService.subscribe(dto);
    }

    @Delete('/unsubscribe')
    @HttpCode(HttpStatus.NO_CONTENT)
    async unsubscribe(@Body('endpoint') endpoint: PushSubscription['endpoint']): Promise<void> {
        return this.notificationsService.unsubscribe(endpoint);
    }
}
