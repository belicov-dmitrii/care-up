'use client';

export default function EnablePushButton() {
    const handleEnable = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const OneSignal = (window as any).OneSignal;
        if (!OneSignal) return;

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        await OneSignal.Notifications.requestPermission();
    };

    return <button onClick={handleEnable}>Enable notifications</button>;
}
