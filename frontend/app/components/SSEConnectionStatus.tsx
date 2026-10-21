import s from './SSEConnectionStatus.module.css';
import type { ConnectionStatus } from '@/types/types';

interface Props {
    status: ConnectionStatus;
}

export default function SSEConnectionStatus({ status }: Props): React.ReactElement {
    const label = status === 'connecting' ? 'Connecting...' : status === 'connected' ? 'Connected' : 'Disconnected';

    const classes = status === 'connected' ? s._connected : status === 'disconnected' ? s._disconnected : '';

    return (
        <div className={`${s.wrapper}`}>
            <div className={`${s.status} ${classes}`}>{label}</div>
        </div>
    );
}
