import { SpellConfig } from '@shared/spells/spells.types';
import { useEffect, useRef, useState } from 'react';
import { loadConfigs } from '@/lib/repository/configs/configs';
import { DEFAULT_CONFIGS } from '@/app/constants/configs';
import { connectStream } from '@/lib/repository/sse-stream/sse-stream';
import { SetStateFunc } from '@/types/types';

export function useSpellConfig(setIsCasting: SetStateFunc<boolean>) {
    const [configs, setConfigs] = useState<SpellConfig>(DEFAULT_CONFIGS);
    const [isConnected, setIsConnected] = useState(false);
    const [sseError, setSseError] = useState<string | null>(null);

    const isInitialized = useRef(false);
    const isReconnecting = useRef(false);

    useEffect(() => {
        let eventSource: EventSource | null = null;
        let cancelled = false;

        loadConfigs().then((config) => {
            if (cancelled) return;

            setConfigs(config || DEFAULT_CONFIGS);
            setIsCasting(config?.status === 'RUNNING');
            eventSource = connectStream({ eventSource, setConfigs, setIsConnected, setSseError });
            isInitialized.current = true;
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
        if (isInitialized.current && isConnected && !sseError && !isReconnecting.current) {
            isReconnecting.current = true;

            loadConfigs()
                .then((configs) => {
                    setConfigs(configs || DEFAULT_CONFIGS);
                })
                .finally(() => (isReconnecting.current = false));
        }
    }, [isConnected, sseError]);

    return {
        configs,
        setConfigs,
        isConnected,
        sseError,
    };
}
