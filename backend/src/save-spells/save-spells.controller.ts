import { Controller, Post } from '@nestjs/common';
import { BaseAnswer } from '../shared/spells/spells.types.js';
import { SaveSpellsService } from './save-spells.service.js';

@Controller('spells')
export class SaveSpellsController {
    constructor(private readonly saveService: SaveSpellsService) {}

    @Post('/save')
    saveSpells(): Promise<BaseAnswer> {
        return this.saveService.saveSpells();
    }
}
