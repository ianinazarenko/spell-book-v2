import type { SpellConfig } from '@shared/spells/spells.types';

import { useEffect, useRef, useState } from 'react';

import { DEFAULT_CONFIGS } from '@/app/constants/configs';
import { ESSEStatus } from '@/app/constants/sse';
import { loadConfigs } from '@/lib/repository/configs/configs';
import { connectStream } from '@/lib/repository/sse-stream/sse-stream';

export function useSpellConfig(syncSpells: () => Promise<void>) {
    const [configs, setConfigs] = useState<SpellConfig>(DEFAULT_CONFIGS);
    // sse connection
    const [sseStatus, setSseStatus] = useState<ESSEStatus>(ESSEStatus.Connecting);
    const [sseError, setSseError] = useState<string | null>(null);

    const loadRequestId = useRef<number>(0);

    const isConnected = sseStatus === ESSEStatus.Connected;

    // Apply only latest read request
    function updateConfigsState(requestId: number, configs: Partial<SpellConfig>): void {
        if (requestId === loadRequestId.current) {
            setConfigs((prev) => ({ ...prev, ...configs }));
        }
    }

    // Apply configs change and set all other read requests as outdated
    function applyConfigsChange(configs: Partial<SpellConfig>): void {
        setConfigs((prev) => ({ ...prev, ...configs }));
        ++loadRequestId.current;
    }

    useEffect(() => {
        let eventSource: EventSource | null = null;
        let cancelled = false;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const requestId = ++loadRequestId.current;
                loadConfigs().then((configs) => updateConfigsState(requestId, configs ?? {}));
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        const requestId = ++loadRequestId.current;
        loadConfigs().then((configs) => {
            if (cancelled) return;

            updateConfigsState(requestId, configs || DEFAULT_CONFIGS);

            eventSource = connectStream({
                eventSource,
                setSseStatus,
                setSseError,
                applyConfigsChange,
                syncSpells,
            });
        });

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            cancelled = true;
            if (eventSource) {
                eventSource.close();
                setSseStatus(ESSEStatus.Disconnected);
            }
        };
    }, []);

    useEffect(() => {
        if (isConnected && !sseError) {
            const requestId = ++loadRequestId.current;
            loadConfigs().then((configs) => updateConfigsState(requestId, configs ?? {}));
            void syncSpells();
        }
    }, [isConnected, sseStatus, sseError]);

    return {
        configs,
        applyConfigsChange,
        isConnected,
        sseError,
        sseStatus,
    };
}
