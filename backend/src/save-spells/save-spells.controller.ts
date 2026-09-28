import { Controller, Get, Post } from '@nestjs/common';
import { SavedSpellItem } from '../shared/spells/spells.types.js';
import { SaveSpellsService } from './save-spells.service.js';
import { SpellJob } from '../generated/prisma/client.js';

@Controller('spells')
export class SaveSpellsController {
    constructor(private readonly saveService: SaveSpellsService) {}

    @Get('/saved')
    getSavedSpells(): Promise<SavedSpellItem[]> {
        return this.saveService.getSavedSpells();
    }

    @Post('/save')
    saveSpells(): Promise<SavedSpellItem[]> {
        return this.saveService.saveSpells();
    }

    @Post('/restore')
    restoreSpells(): Promise<SpellJob[]> {
        return this.saveService.restoreSpells();
    }
}
