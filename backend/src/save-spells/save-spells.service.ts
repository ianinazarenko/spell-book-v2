import {
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseAnswer, SavedSpellItem } from '../shared/spells/spells.types.js';

@Injectable()
export class SaveSpellsService {
    constructor(private readonly prisma: PrismaService) {}

    async getSavedSpells(): Promise<SavedSpellItem[]> {
        return await this.prisma.savedSpell.findMany();
    }

    async saveSpells(): Promise<SavedSpellItem[]> {
        const currentSpells: SavedSpellItem[] = await this.prisma.spellJob.findMany({
            select: {
                id: true,
                spellText: true,
            },
        });

        if (!currentSpells.length) {
            throw new NotFoundException({
                message: `There is no spells to save`,
            });
        }

        await this.prisma.$transaction([
            this.prisma.savedSpell.deleteMany(),
            this.prisma.savedSpell.createMany({ data: currentSpells }),
        ]);

        return currentSpells;
    }
}
