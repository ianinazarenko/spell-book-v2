import { SpellConfig } from '@shared/spells/spells.types';
import { useEffect, useState } from 'react';
import { loadConfigs } from '@/lib/repository/configs/configs';
import { DEFAULT_CONFIGS } from '@/app/constants/configs';
import { connectStream } from '@/lib/repository/sse-stream/sse-stream';
import { SetStateFunc } from '@/types/types';

export function useSpellConfig(setIsCasting: SetStateFunc<boolean>) {
    const [configs, setConfigs] = useState<SpellConfig>(DEFAULT_CONFIGS);
    const [isConnected, setIsConnected] = useState(false);
    const [sseError, setSseError] = useState<string | null>(null);

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
        if (isConnected && !sseError) {
            loadConfigs().then((configs) => setConfigs(configs || DEFAULT_CONFIGS));
        }
    }, [isConnected, sseError]);

    return {
        configs,
        setConfigs,
        isConnected,
        sseError,
    };
}
