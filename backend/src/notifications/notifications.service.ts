import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionDto } from './subscription.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as webPush from 'web-push';
import { Subscription } from '../shared/spells/spells.types.js';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(private readonly prisma: PrismaService) {
        if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;

        webPush.setVapidDetails(
            process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
            process.env.VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        );
    }

    async subscribe(dto: SubscriptionDto): Promise<Subscription> {
        return this.prisma.pushSubscription.upsert({
            where: { endpoint: dto.endpoint },

            update: {
                p256dh: dto.keys.p256dh,
                auth: dto.keys.auth,
            },

            create: {
                endpoint: dto.endpoint,
                p256dh: dto.keys.p256dh,
                auth: dto.keys.auth,
            },
        });
    }

    async unsubscribe(endpoint: string): Promise<void> {
        try {
            await this.prisma.pushSubscription.delete({ where: { endpoint } });
        } catch (e) {
            // ignore
        }
    }
}
