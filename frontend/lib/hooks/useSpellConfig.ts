import { SpellConfig } from '@shared/spells/spells.types';
import { useEffect, useRef, useState } from 'react';
import { loadConfigs } from '@/lib/repository/configs/configs';
import { DEFAULT_CONFIGS } from '@/app/constants/configs';
import { connectStream } from '@/lib/repository/sse-stream/sse-stream';
import type { ConnectionStatus, SetStateFunc } from '@/types/types';

export function useSpellConfig() {
    const [configs, setConfigs] = useState<SpellConfig>(DEFAULT_CONFIGS);
    // sse connection
    const [isConnected, setIsConnected] = useState(false);
    const [sseError, setSseError] = useState<string | null>(null);

    const loadRequestId = useRef<number>(0);

    const connectionStatus: ConnectionStatus = isConnected
        ? 'connected'
        : sseError
          ? 'disconnected'
          : 'connecting';

    // Apply only read latest requests
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

    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            const requestId = ++loadRequestId.current;
            loadConfigs().then((configs) => updateConfigsState(requestId, configs ?? {}));
        }
    }

    useEffect(() => {
        let eventSource: EventSource | null = null;
        let cancelled = false;

        document.addEventListener('visibilitychange', handleVisibilityChange);

        const requestId = ++loadRequestId.current;
        loadConfigs().then((configs) => {
            if (cancelled) return;

            updateConfigsState(requestId, configs || DEFAULT_CONFIGS);

            eventSource = connectStream({
                eventSource,
                setIsConnected,
                setSseError,
                applyConfigsChange,
            });
        });

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            cancelled = true;
            if (eventSource) {
                eventSource.close();
                setIsConnected(false);
            }
        };
    }, []);

    useEffect(() => {
        if (isConnected && !sseError) {
            const requestId = ++loadRequestId.current;
            loadConfigs().then((configs) => updateConfigsState(requestId, configs ?? {}));
        }
    }, [isConnected, sseError]);

    return {
        configs,
        applyConfigsChange,
        isConnected,
        sseError,
        connectionStatus,
    };
}
