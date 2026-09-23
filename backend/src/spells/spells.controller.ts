import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CreateSpellDto } from './create-spell.dto.js';
import { SpellsService } from './spells.service.js';

@Controller('spells')
export class SpellsController {
    constructor(private readonly spellsService: SpellsService) {}

    @Get('/')
    getAllSpells() {
        return this.spellsService.getAllSpells();
    }

    @Post('/create')
    createSpell(@Body() dto: CreateSpellDto) {
        return this.spellsService.createSpell(dto);
    }

    @Delete('/:id/delete')
    deleteSpell(@Param('id') id: string) {
        return this.spellsService.deleteSpell(id);
    }

    @Delete('/delete-all')
    deleteAllSpells() {
        return this.spellsService.deleteAllSpells();
    }
}
