import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { PrismaModule } from './prisma/prisma.module.js';
import { SpellsModule } from './spells/spells.module.js';
import { CastSpellsModule } from './cast-spells/cast-spells.module.js';
import { SpellConfigModule } from './spell-configs/spell-config.module.js';
import { SaveSpellsModule } from './save-spells/save-spells.module.js';

@Module({
    imports: [PrismaModule, SpellsModule, SpellConfigModule, CastSpellsModule, SaveSpellsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
