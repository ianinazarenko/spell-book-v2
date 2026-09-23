import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SpellConfigService } from './spell-config.service.js';
import { CreateConfigDto } from './create-config.dto.js';

@Controller('config')
export class SpellConfigController {
    constructor(private readonly configService: SpellConfigService) {}

    @Get('/')
    getConfigs() {
        return this.configService.getConfig();
    }

    @Post('/update')
    updateConfig(@Body() dto: CreateConfigDto) {
        return this.configService.saveConfing(dto);
    }
}
