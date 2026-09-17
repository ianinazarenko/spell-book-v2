import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service.js';
import { CreateSpellDto } from './spells/create-spell.dto.js';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('health')
    getHealth(): { status: string; timestamp: string } {
        return this.appService.getHealth();
    }

    @Get('spells')
    getAllSpells() {
        return this.appService.getAllSpells();
    }

    @Get('spells/:id')
    getSpellById(@Param('id') id: string) {
        return this.appService.getSpellById(id);
    }

    @Post('spells')
    createSpell(@Body() dto: CreateSpellDto) {
        return this.appService.createSpell(dto);
    }
}
