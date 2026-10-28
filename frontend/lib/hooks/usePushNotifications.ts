'use client';

import { useEffect, useState } from 'react';

import { subscribe, unsubscribe } from '@/lib/repository/notifications/notifications';
import { urlBase64ToUint8Array } from '@/lib/utils/vapid';

export function usePushNotifications() {
    const [isSupported, setIsSupported] = useState<boolean>(false);
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function subscribeToPush() {
        setIsLoading(true);

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert(`Permission was not granted`);
                return;
            }

            const registration = await navigator.serviceWorker.ready;
            const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

            if (!vapidKey) {
                throw new Error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is missing');
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey),
            });

            await subscribe(subscription);
            setIsSubscribed(true);
        } catch (err) {
            console.error('Error while subscribe to Push notifications service', err);
        } finally {
            setIsLoading(false);
        }
    }

    async function unsubscribeFromPush() {
        setIsLoading(true);

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await unsubscribe({ endpoint: subscription.endpoint });
                await subscription.unsubscribe();
                setIsSubscribed(false);
            }
        } catch (err) {
            console.error('Error while unsubscribeFromPush', err);
        } finally {
            setIsLoading(false);
        }
    }

    async function checkExistingSubscription() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(Boolean(subscription));
        } catch (err) {
            console.warn('Could not get subscription', err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            // Возможности браузера проверяем после появления компонента.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsSupported(true);
            void checkExistingSubscription();
        } else {
            setIsSupported(false);
            setIsLoading(false);
        }
    }, []);

    return {
        isSupported,
        isSubscribed,
        isLoading,
        subscribeToPush,
        unsubscribeFromPush,
    };
}
