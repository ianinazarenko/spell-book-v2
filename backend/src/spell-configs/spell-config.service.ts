import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { SpellConfig } from '../generated/prisma/client.js';
import { CreateConfigDto } from './create-config.dto.js';
import { DEFAULT_COUNT, CONFIG_ID } from '../shared/config/constants.js';

@Injectable()
export class SpellConfigService {
    constructor(private readonly prisma: PrismaService) {}

    async getConfig(): Promise<SpellConfig> {
        const config = await this.prisma.spellConfig.findFirst();

        if (!config) {
            return this.saveConfing({ iterationsTotal: DEFAULT_COUNT });
        }

        return config;
    }

    async saveConfing(dto: CreateConfigDto): Promise<SpellConfig> {
        const iterationsTotal = dto.iterationsTotal ? dto.iterationsTotal : DEFAULT_COUNT;

        return this.prisma.spellConfig.upsert({
            where: { id: CONFIG_ID },
            create: { id: CONFIG_ID, iterationsTotal },
            update: { iterationsTotal, durationMin: dto.durationMin, iterationsCompleted: 0 },
        });
    }

    async clearCount(): Promise<SpellConfig> {
        return this.prisma.spellConfig.update({
            where: { id: CONFIG_ID },
            data: { iterationsCompleted: 0 },
        });
    }
}
