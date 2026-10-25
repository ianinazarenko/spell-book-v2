import { baseUrl } from '@/lib/repository/constants';
import { SpellConfig } from '@shared/spells/spells.types';
import { SetStateFunc } from '@/types/types';
import { ESSEStatus } from '@/app/constants/sse';

const RESOURCE = '/spells/progress';

interface Args {
    eventSource: EventSource | null;
    setSseStatus: SetStateFunc<ESSEStatus>;
    setSseError: SetStateFunc<string | null>;
    applyConfigsChange: (configs: Partial<SpellConfig>) => void;
}

// Build Event Source
export function connectStream({
    eventSource,
    setSseStatus,
    setSseError,
    applyConfigsChange,
}: Args): EventSource {
    // Создаём стандартный браузерный EventSource
    eventSource = new EventSource(`${baseUrl}${RESOURCE}`);

    // Событие успешного открытия соединения
    eventSource.onopen = () => {
        setSseStatus(ESSEStatus.Connected);
        setSseError(null);
    };

    // Получение данных от сервера
    eventSource.onmessage = (event: MessageEvent) => {
        try {
            const updatedConfig: SpellConfig = JSON.parse(event.data);
            applyConfigsChange(updatedConfig);
        } catch (e) {
            console.error('Ошибка парсинга SSE event:', e);
        }
    };

    // Ошибка соединения (например, отвалилась сеть или упал бэкенд)
    eventSource.onerror = (err: Event) => {
        console.error('SSE connection error:', err);

        if (eventSource.readyState === EventSource.CONNECTING) {
            setSseStatus(ESSEStatus.Reconnecting); // Браузер ещё повторяет попытки.
        }

        if (eventSource.readyState === EventSource.CLOSED) {
            setSseStatus(ESSEStatus.Disconnected); // Браузер больше не пытается подключиться.
            setSseError('Lost SSE connection...');
        }

        // EventSource сам попробует переподключиться,
        // но мы фиксируем статус для UI
    };

    return eventSource;
}
