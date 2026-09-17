import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { StartSpellsModule } from './start-spells/start-spells.module.js';

@Module({
    imports: [PrismaModule, StartSpellsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
