import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { StartSpellsService } from './start-spells.service.js';

@Controller('spells')
export class StartSpellController {
    constructor(private readonly startSpellsService: StartSpellsService) {}

    @Post('/start-all')
    @HttpCode(HttpStatus.ACCEPTED)
    startAllSpellsJob() {
        return this.startSpellsService.startAllSpellsJob();
    }

    @Post('/:id/start')
    @HttpCode(HttpStatus.ACCEPTED)
    startSpellJob(@Param('id') id: string) {
        return this.startSpellsService.startSpellJob(id);
    }
}
