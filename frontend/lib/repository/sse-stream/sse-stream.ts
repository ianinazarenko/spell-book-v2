import { baseUrl } from '@/lib/repository/constants';
import { SpellConfig } from '@shared/spells/spells.types';
import { SetStateFunc } from '@/types/types';

const RESOURCE = '/spells/progress';

interface Args {
    eventSource: EventSource | null;
    setConfigs: SetStateFunc<SpellConfig>;
    setIsConnected: SetStateFunc<boolean>;
    setSseError: SetStateFunc<string | null>;
}

// Build Event Source
export function connectStream({
    eventSource,
    setConfigs,
    setIsConnected,
    setSseError,
}: Args): EventSource {
    // Создаём стандартный браузерный EventSource
    eventSource = new EventSource(`${baseUrl}${RESOURCE}`);

    // Событие успешного открытия соединения
    eventSource.onopen = () => {
        setIsConnected(true);
        setSseError(null);
    };

    // Получение данных от сервера
    eventSource.onmessage = (event: MessageEvent) => {
        try {
            const updatedConfig: SpellConfig = JSON.parse(event.data);
            setConfigs(updatedConfig);
        } catch (e) {
            console.error('Ошибка парсинга SSE event:', e);
        }
    };

    // Ошибка соединения (например, отвалилась сеть или упал бэкенд)
    eventSource.onerror = (err: Event) => {
        console.error('SSE connection error:', err);
        setIsConnected(false);
        setSseError('Lost SSE connection...');
        // EventSource сам попробует переподключиться,
        // но мы фиксируем статус для UI
    };

    return eventSource;
}
