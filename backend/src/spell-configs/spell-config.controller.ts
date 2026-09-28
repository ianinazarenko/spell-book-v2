import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SpellConfigService } from './spell-config.service.js';
import { CreateConfigDto } from './create-config.dto.js';
import { SpellConfig } from '../generated/prisma/client.js';

@Controller('config')
export class SpellConfigController {
    constructor(private readonly configService: SpellConfigService) {}

    @Get('/')
    getConfigs(): Promise<SpellConfig> {
        return this.configService.getConfig();
    }

    @Post('/update')
    updateConfig(@Body() dto: CreateConfigDto): Promise<SpellConfig> {
        return this.configService.saveConfing(dto);
    }

    @Post('/clear-count')
    clearCount(): Promise<SpellConfig> {
        return this.configService.clearCount();
    }
}
