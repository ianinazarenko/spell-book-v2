import { Module } from '@nestjs/common';
import { SSEService } from './sse.service.js';
import { SSEController } from './sse.controller.js';

@Module({
    providers: [SSEService],
    controllers: [SSEController],
    exports: [SSEService],
})
export class SSEModule {}
