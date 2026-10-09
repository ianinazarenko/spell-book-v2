import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { PrismaModule } from './prisma/prisma.module.js';
import { SpellsModule } from './spells/spells.module.js';
import { CastSpellsModule } from './ritual/cast/cast-spells.module.js';
import { SpellConfigModule } from './ritual/config/spell-config.module.js';
import { SaveSpellsModule } from './spells/saved/save-spells.module.js';

@Module({
    imports: [PrismaModule, SpellsModule, SpellConfigModule, CastSpellsModule, SaveSpellsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
