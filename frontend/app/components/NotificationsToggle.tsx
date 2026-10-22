'use client';

import { usePushNotifications } from '@/lib/hooks/usePushNotifications';
import buttonStyles from '@/app/components/ControlButton.module.css';
import styles from '@/app/components/NotificationsToggle.module.css';

export default function NotificationsToggle() {
    const { isSupported, isSubscribed, isLoading, subscribeToPush, unsubscribeFromPush } =
        usePushNotifications();

    if (!isSupported) {
        return <span>Pushes are not supported</span>;
    }

    const btnTxt = isLoading ? 'Loading...' : isSubscribed ? 'Turn Off 🔔' : 'Turn On 🔕';

    return (
        <div className={`${styles.row}`}>
            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonSecondary}`}
                onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
            >
                {btnTxt}
            </button>
        </div>
    );
}
