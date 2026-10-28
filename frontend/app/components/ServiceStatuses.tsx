import type { ESSEStatus } from '@/app/constants/sse';

import NotificationsToggle from '@/app/components/NotificationsToggle';
import SSEConnectionStatus from '@/app/components/SSEConnectionStatus';

import styles from './ServiceStatuses.module.css';

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
