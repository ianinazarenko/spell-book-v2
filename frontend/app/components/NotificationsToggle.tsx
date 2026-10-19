'use client';

import { usePushNotifications } from '@/lib/hooks/usePushNotifications';
import buttonStyles from '@/app/components/ControlButton.module.css';

export default function NotificationsToggle() {
    const { isSupported, isSubscribed, isLoading, subscribeToPush, unsubscribeFromPush } =
        usePushNotifications();

    if (!isSupported) {
        return <span>Push notifications are not supported</span>;
    }

    const btnTxt = isLoading ? 'Loading...' : isSubscribed ? 'Push Off' : 'Push On';

    return (
        <div>
            <span>{isSubscribed ? '🔔 Pushes are active' : '🔕 Pushes are inactive'}</span>

            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonSecondary}`}
                onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
            >
                {btnTxt}
            </button>
        </div>
    );
}
