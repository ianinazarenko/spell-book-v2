import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SpellStatus } from '../generated/prisma/enums.js';

interface AnswerStatus {
    message: string;
    status: SpellStatus;
    success: boolean;
}

@Injectable()
export class StartSpellsService {
    constructor(private readonly prisma: PrismaService) {}

    async startAllSpellsJob(): Promise<void> {
        //     const spells = await this.prisma.spellJob.findMany({
        //         orderBy: { createdAt: 'desc' },
        //     });
        //     if (!spells || !spells.length) {
        //         throw new Error('There is no spells to cast');
        //     }
        //     await this.prisma.spellJob.updateMany({
        //         data: { status: 'RUNNING' },
        //     });
    }

    async startSpellJob(id: string): Promise<{ message: string; status: SpellStatus }> {
        const spell = await this.prisma.spellJob.findUnique({
            where: { id },
        });

        if (!spell || spell.status === 'RUNNING') {
            throw new Error('Task cannot be started');
        }

        await this.prisma.spellJob.update({
            where: { id },
            data: { status: 'RUNNING' },
        });

        // 3. Запускаем АСИНХРОННЫЙ фоновый процесс без await!
        // Важно: мы НЕ делаем await для runBackgroundLoop, чтобы HTTP-запрос не ждал завершения!
        this.runBackgroundLoop(id, spell.iterationsTotal, spell.durationMin);

        return { message: 'Spell execution started', status: 'RUNNING' };
    }

    private async runBackgroundLoop(id: string, totalIterations: number, duration: number) {
        const INTERVAL_MS = 1000;

        try {
            for (let i = 0; i < totalIterations; i++) {
                await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));

                // Имитация внезапной ошибки (для тестов можно раскомментировать)
                if (i === 3) throw new Error('Magic overflow: spell casting failed!');

                // Чтобы не словить Race Condition (когда два запроса параллельно перезаписывают счетчик), в SQL / Prisma принято обновлять счетчик не через переприсваивание (completed = completed + 1 в JS), а средствами самого SQL:
                await this.prisma.spellJob.update({
                    where: { id },
                    data: {
                        iterationsCompleted: { increment: 1 },
                    },
                });
            }

            await this.prisma.spellJob.update({
                where: { id },
                data: { status: 'COMPLETED' },
            });
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';

            await this.prisma.spellJob.update({
                where: { id },
                data: {
                    status: 'FAILED',
                    errorMessage,
                },
            });
        }
    }
}
