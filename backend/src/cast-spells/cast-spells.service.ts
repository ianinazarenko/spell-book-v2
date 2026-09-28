import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SpellStatus } from '../generated/prisma/enums.js';
import { CONFIG_ID } from '../shared/config/constants.js';
import { SpellConfig } from '../generated/prisma/client.js';

interface AnswerStatus {
    message: string;
    status: SpellStatus;
    success: boolean;
}

@Injectable()
export class CastSpellsService {
    constructor(private readonly prisma: PrismaService) {}

    async castAllSpellsJob(): Promise<SpellConfig> {
        const spells = await this.prisma.spellJob.findMany({
            orderBy: { createdAt: 'asc' },
        });

        const config = await this.prisma.spellConfig.findUnique({ where: { id: CONFIG_ID } });

        if (!config || !spells.length) {
            throw new Error('There is no spells to cast');
        }

        const newConfig = await this.prisma.spellConfig.update({
            where: { id: CONFIG_ID },
            data: { status: 'RUNNING' },
        });

        // 3. Запускаем АСИНХРОННЫЙ фоновый процесс без await!
        // Важно: мы НЕ делаем await для runBackgroundLoop, чтобы HTTP-запрос не ждал завершения!
        this.runBackgroundLoop(config.iterationsTotal);

        return newConfig;
    }

    async stopAllSpellsJob(): Promise<SpellConfig> {
        const newConfig = await this.prisma.spellConfig.update({
            where: { id: CONFIG_ID },
            data: { status: 'QUEUED' },
        });

        return newConfig;
    }

    private async runBackgroundLoop(totalIterations: number): Promise<void> {
        const INTERVAL_MS = 2000;

        try {
            for (let i = 0; i < totalIterations; i++) {
                await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));

                // Имитация внезапной ошибки (для тестов можно раскомментировать)
                // if (i === 3) throw new Error('Magic overflow: spell casting failed!');

                const config = await this.prisma.spellConfig.findUnique({
                    where: { id: CONFIG_ID },
                });

                if (!config || config.status !== 'RUNNING') {
                    break;
                }

                // Чтобы не словить Race Condition (когда два запроса параллельно перезаписывают счетчик), в SQL / Prisma принято обновлять счетчик не через переприсваивание (completed = completed + 1 в JS), а средствами самого SQL:
                await this.prisma.spellConfig.update({
                    where: { id: CONFIG_ID },
                    data: {
                        iterationsCompleted: { increment: 1 },
                    },
                });
            }

            await this.prisma.spellConfig.update({
                where: { id: CONFIG_ID },
                data: { status: 'COMPLETED' },
            });
        } catch (e) {
            // const errorMessage = e instanceof Error ? e.message : 'Unknown error';

            await this.prisma.spellConfig.update({
                where: { id: CONFIG_ID },
                data: {
                    status: 'FAILED',
                    // errorMessage,
                },
            });
        }
    }

    // private async runBackgroundLoop(id: string, totalIterations: number, duration: number) {
    //     const INTERVAL_MS = 2000;

    //     try {
    //         for (let i = 0; i < totalIterations; i++) {
    //             await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));

    //             // Имитация внезапной ошибки (для тестов можно раскомментировать)
    //             if (i === 3) throw new Error('Magic overflow: spell casting failed!');

    //             // Чтобы не словить Race Condition (когда два запроса параллельно перезаписывают счетчик), в SQL / Prisma принято обновлять счетчик не через переприсваивание (completed = completed + 1 в JS), а средствами самого SQL:
    //             await this.prisma.spellJob.update({
    //                 where: { id },
    //                 data: {
    //                     iterationsCompleted: { increment: 1 },
    //                 },
    //             });
    //         }

    //         await this.prisma.spellJob.update({
    //             where: { id },
    //             data: { status: 'COMPLETED' },
    //         });
    //     } catch (e) {
    //         const errorMessage = e instanceof Error ? e.message : 'Unknown error';

    //         await this.prisma.spellJob.update({
    //             where: { id },
    //             data: {
    //                 status: 'FAILED',
    //                 errorMessage,
    //             },
    //         });
    //     }
    // }

    // async castSpellJob(id: string): Promise<{ message: string; status: SpellStatus }> {
    //     const spell = await this.prisma.spellJob.findUnique({
    //         where: { id },
    //     });

    // if (!spell || spell.status === 'RUNNING') {
    //     throw new Error('Task cannot be started');
    // }

    // await this.prisma.spellJob.update({
    //     where: { id },
    //     data: { status: 'RUNNING' },
    // });

    // 3. Запускаем АСИНХРОННЫЙ фоновый процесс без await!
    // Важно: мы НЕ делаем await для runBackgroundLoop, чтобы HTTP-запрос не ждал завершения!
    // this.runBackgroundLoop(id, spell.iterationsTotal, spell.durationMin);

    // return { message: 'Spell execution started', status: 'RUNNING' };
    // }
}
