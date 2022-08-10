import firebase from 'firebase/compat'
import { FIREBASE_CONFIG } from '../constants/firebase'
import { RoutePath } from '../route/path'

declare let clients: Clients

firebase.initializeApp(FIREBASE_CONFIG)
const messaging = firebase.messaging()

export const HOME_URL =
  import.meta.env.NEXT_PUBLIC_HOME_URL || 'https://mail3.me'
export const APP_URL =
  import.meta.env.NEXT_PUBLIC_APP_URL || 'https://app.mail3.me'

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || ''
  const notificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.image,
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
