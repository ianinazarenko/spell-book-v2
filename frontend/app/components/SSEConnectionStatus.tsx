import s from './SSEConnectionStatus.module.css';
import { ESSEStatus } from '@/app/constants/sse';

interface Props {
    status: ESSEStatus;
}

export default function SSEConnectionStatus({ status }: Props): React.ReactElement {
    const label = {
        [ESSEStatus.Disconnected]: 'Lost SSE connection',
        [ESSEStatus.Reconnecting]: 'Reconnecting...',
        [ESSEStatus.Connecting]: 'Connecting...',
        [ESSEStatus.Connected]: 'Connected',
    }[status];

    const classes = {
        [ESSEStatus.Disconnected]: s._disconnected,
        [ESSEStatus.Reconnecting]: s._reconnecting,
        [ESSEStatus.Connecting]: s._connecting,
        [ESSEStatus.Connected]: s._connected,
    }[status];

    return (
        <div className={`${s.wrapper}`}>
            <div className={`${s.status} ${classes}`}>{label}</div>
        </div>
    );
}
