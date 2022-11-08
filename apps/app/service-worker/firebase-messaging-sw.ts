import { get as getIndexedDbById, set as setIndexedDbById } from 'idb-keyval'
import { APP_URL } from '../constants/env/apps'
import { RoutePath } from '../route/path'
import { generateAvatarUrl } from '../utils/string/generateAvatarUrl'
import { truncateMiddle0xMail } from '../utils/string/truncateMiddle0xMail'
import { notificationLogsStore } from '../utils/notification'

interface PayloadData {
  message_id: string
  notification_type: string
}

interface CurrentEvent extends ExtendableEvent {
  notification: {
    data: PayloadData
    close: () => void
  }
}

interface Payload {
  data: PayloadData
  from: string
  priority: string
  notification: {
    title: string
    body: string
  }
  fcmMessageId: string
}

const notificationclick = 'notificationclick'
const push = 'push'

type EventMap = {
  [notificationclick]: CurrentEvent
  [push]: PushEvent
}

type EventName = keyof EventMap

type AddEventListener = <E = EventName>(
  eventName: E,
  callback: (e: EventMap[EventName]) => void
) => void | Promise<void>

interface Self {
  addEventListener: AddEventListener
  registration: ServiceWorkerRegistration
}

declare let clients: Clients
declare let self: Self

self.addEventListener(notificationclick, (e) => {
  const event = e as EventMap[typeof notificationclick]
  event.notification.close()

  const openUrl = `${APP_URL}${
    event.notification.data.notification_type === 'community_message'
      ? RoutePath.Subscription
      : RoutePath.Message
  }/${event.notification.data.message_id}`

  clients
    .openWindow(openUrl)
    .then((windowClient) => (windowClient ? windowClient.focus() : null))
})

self.addEventListener(push, async (e) => {
  const event = e as EventMap[typeof push]
  const text = event.data?.text()
  if (!text) return
  const payload = JSON.parse(text) as Payload
  if (!payload) return
  const key = payload.data.message_id
  if (await getIndexedDbById(key, notificationLogsStore)) return
  const notificationTitle = truncateMiddle0xMail(
    payload.notification?.title || ''
  )
  const notificationIcon = payload.notification?.title
    ? await generateAvatarUrl(payload.notification.title, {
        omitMailSuffix: true,
      })
    : undefined
  const notificationOptions = {
    body: payload.notification?.body,
    icon: notificationIcon,
    data: payload.data,
  }
  await setIndexedDbById(key, payload, notificationLogsStore)
  await self.registration.showNotification(
    notificationTitle,
    notificationOptions
  )
})
