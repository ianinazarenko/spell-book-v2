import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { SpellConfig } from '../generated/prisma/client.js';
import { CreateConfigDto } from './create-config.dto.js';

const DEFAULT_COUNT = 1777;
const CONFIG_ID = 'spell-configs';

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
            update: { iterationsTotal, durationMin: dto.durationMin },
        });
    }
}
