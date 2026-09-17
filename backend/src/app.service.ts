import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpellDto } from './spells/create-spell.dto.js';
import { PrismaService } from './prisma/prisma.service.js';
import { SpellJob } from './generated/prisma/client.js';

@Injectable()
export class AppService {
    constructor(private readonly prisma: PrismaService) {}

    getHello(): string {
        return 'Hello World!';
    }

    getHealth(): { status: string; timestamp: string } {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }

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

    async getSpellById(id: string): Promise<SpellJob> {
        const spell = await this.prisma.spellJob.findUnique({ where: { id } });

        if (!spell) {
            throw new NotFoundException(`Spell with ID ${id} is not found`);
        }

        return spell;
    }
}
