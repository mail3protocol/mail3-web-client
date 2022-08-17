import { initializeApp } from 'firebase/app'
import {
  getMessaging,
  getToken,
  onMessage,
  MessagePayload,
} from 'firebase/messaging'
import { FIREBASE_CONFIG, FIREBASE_MESSAGING_VAPID_KEY } from '../constants'

const firebaseApp = initializeApp(FIREBASE_CONFIG)
const messaging = getMessaging(firebaseApp)

export const fetchToken = async () =>
  getToken(messaging, {
    vapidKey: FIREBASE_MESSAGING_VAPID_KEY,
  })

export function onMessageListener(callback: (payload: MessagePayload) => void) {
  return onMessage(messaging, (payload) => {
    callback(payload)
  })
}
