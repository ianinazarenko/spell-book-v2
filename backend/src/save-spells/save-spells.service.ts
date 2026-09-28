import {
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BaseAnswer } from '../shared/spells/spells.types.js';

@Injectable()
export class SaveSpellsService {
    constructor(private readonly prisma: PrismaService) {}

    async saveSpells(): Promise<BaseAnswer> {
        try {
            const currentSpells = await this.prisma.spellJob.findMany({
                select: {
                    id: true,
                    spellText: true,
                },
            });

            if (!currentSpells.length) {
                throw new NotFoundException({
                    success: false,
                    message: `There is no spells to save`,
                });
            }

            await this.prisma.$transaction([
                this.prisma.savedSpell.deleteMany(),
                this.prisma.savedSpell.createMany({ data: currentSpells }),
            ]);
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException(
                {
                    success: false,
                    message: 'Cannot save spells',
                },
                { cause: e }
            );
        }

        return { success: true, message: 'Spells are saved' };
    }
}
