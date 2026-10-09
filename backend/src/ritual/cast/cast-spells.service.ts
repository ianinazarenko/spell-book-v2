import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SpellStatus } from '../../generated/prisma/enums.js';
import { CONFIG_ID } from '../../shared/config/constants.js';
import { Prisma, SpellConfig } from '../../generated/prisma/client.js';
import { randomUUID } from 'node:crypto';
import { FileLogger } from '../../file-logger/file-logger.js';
import { SpellItem } from '../../shared/spells/spells.types.js';

interface AnswerStatus {
    message: string;
    status: SpellStatus;
    success: boolean;
}

@Injectable()
export class CastSpellsService implements OnModuleInit {
    private readonly logger = new FileLogger(CastSpellsService.name);

    constructor(private readonly prisma: PrismaService) {}

    async onModuleInit(): Promise<void> {
        await this.recoverStaleJobs();
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
            data: { status: 'RUNNING', iterationsCompleted: isNewRitual ? 0 : undefined, runId },
        });

        // 3. Запускаем АСИНХРОННЫЙ фоновый процесс без await!
        // Важно: мы НЕ делаем await для runBackgroundLoop, чтобы HTTP-запрос не ждал завершения!
        this.runBackgroundLoop({
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
        const INTERVAL_MS = 2000;

        try {
            const count = Math.max(0, totalIterations - completed);
            for (let i = 0; i < count; i++) {
                await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));

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
                    },
                });

                this.logger.log(
                    `\n✨🔮 Casting ritual: ${newConfig.iterationsCompleted}/${newConfig.iterationsTotal}\n${spellsString}`
                );
            }

            await this.prisma.spellConfig.update({
                where: { id: CONFIG_ID },
                data: { status: 'COMPLETED' },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                return;
            }

            await this.prisma.spellConfig.update({
                where: { id: CONFIG_ID },
                data: {
                    status: 'FAILED',
                },
            });

            this.logger.error(
                `❌ Failed to cast spells ritual for run ${runId}: ${e instanceof Error ? e.message : String(e)}`,
                e instanceof Error ? e.stack : undefined,
                CastSpellsService.name
            );
        }
    }

    private prepareSpellsString(spells: SpellItem[]): string {
        return spells.map((s, i) => `${i + 1}) ${s.spellText}`).join('\n') + '\n// --- // --- //';
    }

    private async recoverStaleJobs(): Promise<void> {
        const { count } = await this.prisma.spellConfig.updateMany({
            where: {
                id: CONFIG_ID,
                status: 'RUNNING',
            },
            data: {
                status: 'FAILED',
            },
        });

        if (count > 0) {
            this.logger.error(`⚠️ Обнаружена зависшая задача. Статус сброшен на FAILED.`);
        }
    }
}
