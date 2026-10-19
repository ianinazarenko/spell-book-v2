import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionDto } from './subscription.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import webPush from 'web-push';
import { Subscription } from '../shared/spells/spells.types.js';
import { Prisma } from '../generated/prisma/client.js';

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
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                return;
            }

            throw e;
        }
    }

    async sendPushToAll(title: string, body: string, url: string = '/'): Promise<void> {
        const subscriptions = await this.prisma.pushSubscription.findMany();
        const payload = JSON.stringify({ title, body, url });

        const sendPromises = subscriptions.map(async (sub) => {
            const pushSub = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth,
                },
            };

            try {
                await webPush.sendNotification(pushSub, payload);
            } catch (err: any) {
                // 410 Gone или 404 Not Found означает, что пользователь отозвал разрешение
                // или подписка просрочена. В этом случае удаляем «тухлую» подписку из БД!
                if (err.statusCode === 410 || err.statusCode === 404) {
                    this.logger.warn(`Удаляем устаревшую подписку: ${sub.endpoint}`);
                    await this.unsubscribe(sub.endpoint);
                } else {
                    this.logger.error(`Ошибка отправки пуша на ${sub.endpoint}`, err);
                }
            }
        });

        await Promise.all(sendPromises);
    }
}
