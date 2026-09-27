import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CreateSpellDto } from './create-spell.dto.js';
import { SpellsService } from './spells.service.js';
import { SpellJob } from '../generated/prisma/client.js';
import { BaseAnswer } from '../shared/spells/spells.types.js';

@Controller('spells')
export class SpellsController {
    constructor(private readonly spellsService: SpellsService) {}

    @Get('/')
    getAllSpells(): Promise<SpellJob[]> {
        return this.spellsService.getAllSpells();
    }

    @Post('/create')
    createSpell(@Body() dto: CreateSpellDto): Promise<SpellJob> {
        return this.spellsService.createSpell(dto);
    }

    @Delete('/:id/delete')
    deleteSpell(@Param('id') id: string): Promise<BaseAnswer> {
        return this.spellsService.deleteSpell(id);
    }

    @Delete('/delete-all')
    deleteAllSpells(): Promise<BaseAnswer> {
        return this.spellsService.deleteAllSpells();
    }
}
