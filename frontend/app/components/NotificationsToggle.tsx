'use client';

import { RiNotification4Line, RiNotificationOffLine } from '@remixicon/react';

import buttonStyles from '@/app/components/ControlButton.module.css';
import styles from '@/app/components/NotificationsToggle.module.css';
import { usePushNotifications } from '@/lib/hooks/usePushNotifications';

export default function NotificationsToggle() {
    const { isSupported, isSubscribed, isLoading, subscribeToPush, unsubscribeFromPush } =
        usePushNotifications();

    if (!isSupported) {
        return <span>Pushes are not supported</span>;
    }

    const btnTxt = isLoading ? 'Loading...' : isSubscribed ? ' Turn Off' : ' Turn On';

    return (
        <div className={`${styles.row}`}>
            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonSecondary}`}
                onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
            >
                {!isLoading &&
                    (isSubscribed ? (
                        <RiNotification4Line size={18} />
                    ) : (
                        <RiNotificationOffLine size={18} />
                    ))}

                {btnTxt}
            </button>
        </div>
    );
}
