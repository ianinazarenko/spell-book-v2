import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { PrismaModule } from './prisma/prisma.module.js';
import { SpellsModule } from './spells/spells.module.js';
import { CastSpellsModule } from './ritual/cast/cast-spells.module.js';
import { SpellConfigModule } from './ritual/config/spell-config.module.js';
import { SaveSpellsModule } from './spells/saved/save-spells.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { SSEModule } from './sse/sse.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
        }),
        PrismaModule,
        SpellsModule,
        SpellConfigModule,
        CastSpellsModule,
        SaveSpellsModule,
        NotificationsModule,
        SSEModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
