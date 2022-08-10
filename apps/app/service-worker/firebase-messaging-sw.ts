import firebase from 'firebase/compat'
import { APP_URL } from '../constants/env/apps'
import { FIREBASE_CONFIG } from '../constants/env/firebase'
import { RoutePath } from '../route/path'
import { generateAvatarUrl } from '../utils/string/generateAvatarUrl'

declare let clients: Clients

firebase.initializeApp(FIREBASE_CONFIG)
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || ''
  const notificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.title
      ? generateAvatarUrl(payload.notification.title)
      : undefined,
    data: payload.data,
  }
  return (
    self as unknown as { registration: ServiceWorkerRegistration }
  ).registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', (e) => {
  interface CurrentEvent extends ExtendableEvent {
    notification: { data: { message_id: string; url: string } }
  }
  const event = e as CurrentEvent

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === event.notification.data.url
          ? Boolean(windowClient.focus())
          : false
      )
      if (!hadWindowToFocus) {
        clients
          .openWindow(
            `https://${APP_URL}${RoutePath.Message}/${event.notification.data.message_id}`
          )
          .then((windowClient) => (windowClient ? windowClient.focus() : null))
      }
    })
  )
})
