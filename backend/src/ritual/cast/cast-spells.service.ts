import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SpellStatus } from '../../generated/prisma/enums.js';
import { CONFIG_ID } from '../../shared/config/constants.js';
import { Prisma, SpellConfig } from '../../generated/prisma/client.js';
import { randomUUID } from 'node:crypto';
import { FileLogger } from '../../file-logger/file-logger.js';
import { SpellItem } from '../../shared/spells/spells.types.js';
import { Observable, Subject } from 'rxjs';
import { NotificationsService } from '../../notifications/notifications.service.js';

interface AnswerStatus {
    message: string;
    status: SpellStatus;
    success: boolean;
}

@Injectable()
export class CastSpellsService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new FileLogger(CastSpellsService.name);
    private readonly ritualProgress$ = new Subject<SpellConfig>();

    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationsService
    ) {}

    async onModuleInit(): Promise<void> {
        await this.recoverStaleJobs();
    }

    onModuleDestroy(): void {
        this.ritualProgress$.complete();
    }

    getProgressStream(): Observable<SpellConfig> {
        return this.ritualProgress$.asObservable();
    }

    async castAllSpellsJob(): Promise<SpellConfig> {
        const spells = await this.prisma.spellJob.findMany({
            orderBy: { createdAt: 'asc' },
        });

        const config = await this.prisma.spellConfig.findUnique({ where: { id: CONFIG_ID } });

        if (!config || !spells.length) {
            throw new Error('There is no spells to cast');
        }

        const spellsString = this.prepareSpellsString(spells);

        const isNewRitual =
            config.status === 'COMPLETED' || config.iterationsCompleted >= config.iterationsTotal;

        const runId = randomUUID();
        const newConfig = await this.prisma.spellConfig.update({
            where: { id: CONFIG_ID },
            data: {
                status: 'RUNNING',
                iterationsCompleted: isNewRitual ? 0 : undefined,
                runId,
                errorMessage: null,
            },
        });

        // 3. Запускаем АСИНХРОННЫЙ фоновый процесс без await!
        // Важно: мы НЕ делаем await для runBackgroundLoop, чтобы HTTP-запрос не ждал завершения!
        void this.runBackgroundLoop({
            runId,
            totalIterations: config.iterationsTotal,
            completed: isNewRitual ? 0 : config.iterationsCompleted,
            spellsString,
        });

        return newConfig;
    }

    async stopAllSpellsJob(): Promise<SpellConfig> {
        const newConfig = await this.prisma.spellConfig.update({
            where: { id: CONFIG_ID },
            data: { status: 'QUEUED' },
        });

        return newConfig;
    }

    private async runBackgroundLoop({
        runId,
        totalIterations,
        completed,
        spellsString,
    }: {
        runId: string;
        totalIterations: number;
        completed: number;
        spellsString: string;
    }): Promise<void> {
        const TICK_MS = 2000;

        try {
            const count = Math.max(0, totalIterations - completed);
            for (let i = 0; i < count; i++) {
                await new Promise((resolve) => setTimeout(resolve, TICK_MS));

                // Имитация внезапной ошибки (для тестов можно раскомментировать)
                // if (i === 3) throw new Error('Magic overflow: spell casting failed!');

                // Чтобы не словить Race Condition (когда два запроса параллельно перезаписывают счетчик), в SQL / Prisma принято обновлять счетчик не через переприсваивание (completed = completed + 1 в JS), а средствами самого SQL:
                const newConfig = await this.prisma.spellConfig.update({
                    where: {
                        id: CONFIG_ID,
                        status: 'RUNNING',
                        runId,
                    },
                    data: {
                        iterationsCompleted: { increment: 1 },
                        status: i + 1 === count ? 'COMPLETED' : 'RUNNING',
                    },
                });

                this.ritualProgress$.next(newConfig);

                this.logger.log(
                    `\n✨🔮 Casting ritual: ${newConfig.iterationsCompleted}/${newConfig.iterationsTotal}\n${spellsString}`
                );

                const NOTIFY_EVERY_MS = 30 * 60 * 1000; // 30 min
                const NOTIFY_EVERY_TICKS = NOTIFY_EVERY_MS / TICK_MS; // 900

                if (i > 0 && i % NOTIFY_EVERY_TICKS === 0) {
                    await this.notificationService.sendPushToAll(
                        '🪄 Magical Operations Center',
                        'The ritual is proceeding normally. No further action is required from you. ✨'
                    );
                }

                if (i + 1 === count) {
                    await this.notificationService.sendPushToAll(
                        '🧙‍♂️ Magical Operations Center',
                        'The spell has been successfully completed. Reality has been notified. You may now relax. ✨'
                    );
                }
            }
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                return;
            }

            await this.prisma.spellConfig.update({
                where: { id: CONFIG_ID, runId, status: 'RUNNING' },
                data: {
                    status: 'FAILED',
                },
            });

            this.logger.error(
                `❌ Failed to cast spells ritual for run ${runId}: ${e instanceof Error ? e.message : String(e)}`,
                e instanceof Error ? e.stack : undefined,
                CastSpellsService.name
            );

            await this.notificationService.sendPushToAll(
                '🧌 Magical Operations Center',
                'Oops. A small magical hiccup. No dragons were harmed. Please try again. 🐉'
            );
        }
    }

    private prepareSpellsString(spells: SpellItem[]): string {
        return spells.map((s, i) => `${i + 1}) ${s.spellText}`).join('\n') + '\n --- ';
    }

    private async recoverStaleJobs(): Promise<void> {
        const errorMessage = `⚠️ Обнаружена зависшая задача. Статус сброшен на FAILED.`;
        const { count } = await this.prisma.spellConfig.updateMany({
            where: {
                id: CONFIG_ID,
                status: 'RUNNING',
            },
            data: {
                status: 'FAILED',
                errorMessage,
            },
        });

        if (count > 0) {
            this.logger.error(errorMessage);
        }
    }
}
