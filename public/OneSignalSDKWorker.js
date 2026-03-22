importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const rawUrl = event.notification?.data?.url || event.notification?.data?.launchURL || '/';

    const urlToOpen = new URL(rawUrl, self.location.origin).href;

    event.waitUntil(
        (async () => {
            const clientList = await clients.matchAll({
                type: 'window',
                includeUncontrolled: true,
            });

            // Prefer an already focused/visible tab on the same origin
            const existingClient =
                clientList.find(
                    (client) => client.url.startsWith(self.location.origin) && client.focused
                ) || clientList.find((client) => client.url.startsWith(self.location.origin));

            if (existingClient) {
                await existingClient.focus();

                existingClient.postMessage({
                    type: 'ONESIGNAL_NAVIGATE',
                    url: urlToOpen,
                });

                return;
            }

            await clients.openWindow(urlToOpen);
        })()
    );
});
