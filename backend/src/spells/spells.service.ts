import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpellDto } from './create-spell.dto.js';
import { Prisma, SpellJob } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SpellsService {
    constructor(private readonly prisma: PrismaService) {}

    async createSpell(dto: CreateSpellDto): Promise<SpellJob> {
        const data = {
            spellText: dto.spell,
            durationMin: dto.duration,
            iterationsTotal: dto.duration,
        };

        return this.prisma.spellJob.create({ data });
    }

    async getAllSpells(): Promise<SpellJob[]> {
        return this.prisma.spellJob.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async deleteSpell(id: string): Promise<{ message: string; success: boolean }> {
        try {
            await this.prisma.spellJob.delete({ where: { id } });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                throw new NotFoundException(`Spell with ID ${id} is not found`);
            } else {
                throw e;
            }
        }

        return { message: `Spell with ID ${id} is deleted`, success: true };
    }

    async deleteAllSpells(): Promise<void> {
        await this.prisma.spellJob.deleteMany();
    }
}
