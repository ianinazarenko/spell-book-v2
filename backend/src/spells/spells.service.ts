import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSpellDto } from './create-spell.dto.js';
import { Prisma, SpellJob } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseAnswer } from '../shared/spells/spells.types.js';

@Injectable()
export class SpellsService {
    constructor(private readonly prisma: PrismaService) {}

    async createSpell(dto: CreateSpellDto): Promise<SpellJob> {
        const data = {
            spellText: dto.spell,
        };

        return this.prisma.spellJob.create({ data });
    }

    async getAllSpells(): Promise<SpellJob[]> {
        return this.prisma.spellJob.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async deleteSpell(id: string): Promise<BaseAnswer> {
        try {
            await this.prisma.spellJob.delete({ where: { id } });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                throw new HttpException(
                    { success: false, message: `Spell with ID ${id} is not found` },
                    HttpStatus.NOT_FOUND
                );
            }

            throw new HttpException(
                { success: false, message: 'Failed to delete spell' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return { success: true, message: `Spell with ID ${id} is deleted` };
    }

    async deleteAllSpells(): Promise<BaseAnswer> {
        try {
            await this.prisma.spellJob.deleteMany();
        } catch {
            throw new HttpException(
                { success: false, message: 'Failed to delete spells' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return { success: true, message: 'All spells are deleted' };
    }
}
