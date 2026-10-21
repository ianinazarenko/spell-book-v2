import { SpellConfig } from '@shared/spells/spells.types';
import { useEffect, useRef, useState } from 'react';
import { loadConfigs } from '@/lib/repository/configs/configs';
import { DEFAULT_CONFIGS } from '@/app/constants/configs';
import { connectStream } from '@/lib/repository/sse-stream/sse-stream';
import type { ConnectionStatus, SetStateFunc } from '@/types/types';

export function useSpellConfig(setIsCasting: SetStateFunc<boolean>) {
    const [configs, setConfigs] = useState<SpellConfig>(DEFAULT_CONFIGS);
    // sse connection
    const [isConnected, setIsConnected] = useState(false);
    const [sseError, setSseError] = useState<string | null>(null);

    const isAlreadyLoading = useRef(false);

    const connectionStatus: ConnectionStatus = isConnected
        ? 'connected'
        : sseError
          ? 'disconnected'
          : 'connecting';

    useEffect(() => {
        let eventSource: EventSource | null = null;
        let cancelled = false;

        loadConfigs().then((config) => {
            if (cancelled) return;

            setConfigs(config || DEFAULT_CONFIGS);
            setIsCasting(config?.status === 'RUNNING');
            eventSource = connectStream({ eventSource, setConfigs, setIsConnected, setSseError });
        });

        return () => {
            if (eventSource) {
                cancelled = true;
                eventSource.close();
                setIsConnected(false);
            }
        };
    }, []);

    useEffect(() => {
        if (configs.status !== 'RUNNING') {
            setIsCasting(false);
        }
    }, [configs.status]);

    useEffect(() => {
        if (isConnected && !sseError && !isAlreadyLoading.current) {
            isAlreadyLoading.current = true;

            loadConfigs()
                .then((configs) => {
                    setConfigs(configs || DEFAULT_CONFIGS);
                })
                .finally(() => (isAlreadyLoading.current = false));
        }
    }, [isConnected, sseError]);

    return {
        configs,
        setConfigs,
        isConnected,
        sseError,
        connectionStatus,
    };
}
