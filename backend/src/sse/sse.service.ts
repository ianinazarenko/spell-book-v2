import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { SpellConfig } from '../generated/prisma/client.js';

@Injectable()
export class SSEService implements OnModuleDestroy {
    private readonly ritualProgress$ = new Subject<SpellConfig>();
    private readonly spellsState$ = new Subject<void>();

    onModuleDestroy(): void {
        this.ritualProgress$.complete();
        this.spellsState$.complete();
    }

    getProgressStream(): Observable<SpellConfig> {
        return this.ritualProgress$.asObservable();
    }

    getSpellsStream(): Observable<void> {
        return this.spellsState$.asObservable();
    }

    emitRitualProgress(newConfig: SpellConfig) {
        this.ritualProgress$.next(newConfig);
    }

    emitSpellsChanged() {
        this.spellsState$.next();
    }
}
