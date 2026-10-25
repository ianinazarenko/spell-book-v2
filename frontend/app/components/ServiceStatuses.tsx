import NotificationsToggle from '@/app/components/NotificationsToggle';

import styles from './ServiceStatuses.module.css';
import SSEConnectionStatus from '@/app/components/SSEConnectionStatus';
import { ESSEStatus } from '@/app/constants/sse';

interface Props {
    connectionStatus: ESSEStatus;
}

export default function ServiceStatuses({ connectionStatus }: Props) {
    return (
        <div className={`${styles.row}`}>
            <SSEConnectionStatus status={connectionStatus} />
            <NotificationsToggle />
        </div>
    );
}
