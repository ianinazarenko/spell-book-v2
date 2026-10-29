import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SavedSpellItem } from '../../shared/spells/spells.types.js';
import { SpellJob } from '../../generated/prisma/client.js';
import { SSEService } from '../../sse/sse.service.js';

@Injectable()
export class SaveSpellsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly sseService: SSEService
    ) {}

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

    async restoreSpells() {
        const savedSpells: SavedSpellItem[] = await this.prisma.savedSpell.findMany();

        if (!savedSpells.length) {
            throw new NotFoundException({
                message: 'There is no saved spells to restore',
            });
        }

        await this.prisma.$transaction([
            this.prisma.spellJob.deleteMany(),
            this.prisma.spellJob.createMany({ data: savedSpells }),
        ]);

        const newSpells: SpellJob[] = await this.prisma.spellJob.findMany();

        this.sseService.emitSpellsChanged();

        return newSpells;
    }
}
