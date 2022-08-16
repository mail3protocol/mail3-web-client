import firebase from 'firebase/compat'
import { APP_URL } from '../constants/env/apps'
import { FIREBASE_CONFIG } from '../constants/env/firebase'
import { RoutePath } from '../route/path'
import { generateAvatarUrl } from '../utils/string/generateAvatarUrl'
import { truncateMiddle0xMail } from '../utils/string/truncateMiddle0xMail'

interface CurrentEvent extends ExtendableEvent {
  notification: {
    data: { message_id: string; url: string }
    close: () => void
  }
}

type AddEventListener = (
  eventName: 'notificationclick',
  callback: (e: CurrentEvent) => void
) => void | Promise<void>

interface Self {
  addEventListener: AddEventListener
  registration: ServiceWorkerRegistration
}

declare let clients: Clients
declare let self: Self

firebase.initializeApp(FIREBASE_CONFIG)
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = truncateMiddle0xMail(
    payload.notification?.title || ''
  )
  const notificationIcon = payload.notification?.title
    ? generateAvatarUrl(payload.notification.title, { omitMailSuffix: true })
    : undefined

  return self.registration.showNotification(notificationTitle, {
    body: payload.notification?.body,
    icon: notificationIcon,
    data: payload.data,
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  clients
    .openWindow(
      `${APP_URL}${RoutePath.Message}/${event.notification.data.message_id}`
    )
    .then((windowClient) => (windowClient ? windowClient.focus() : null))
})
