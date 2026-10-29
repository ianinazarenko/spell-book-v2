import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { merge, map, Observable } from 'rxjs';
import { SSEService } from './sse.service.js';

@Controller('events')
export class SSEController {
    constructor(private readonly sseService: SSEService) {}

    @Sse()
    streamRitualProgress(): Observable<MessageEvent> {
        return merge(
            this.sseService.getProgressStream().pipe(
                map((config) => ({
                    data: config,
                    retry: 5000,
                }))
            ),
            this.sseService.getSpellsStream().pipe(
                map(() => ({
                    type: 'spells-changed',
                    data: {},
                    retry: 5000,
                }))
            )
        );
    }
}
