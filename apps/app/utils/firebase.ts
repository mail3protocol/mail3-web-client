import { initializeApp } from 'firebase/app'
import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage,
} from 'firebase/messaging'
import {
  FIREBASE_CONFIG,
  FIREBASE_MESSAGING_VAPID_KEY,
} from '../constants/env/firebase'

export const firebaseApp = initializeApp(FIREBASE_CONFIG)
export const messaging = getMessaging(firebaseApp)

export function getFirebaseMessagingToken() {
  return getToken(messaging, {
    vapidKey: FIREBASE_MESSAGING_VAPID_KEY,
  })
}

export function deleteFirebaseMessagingToken() {
  return deleteToken(messaging)
}

export function onFirebaseMessage(
  callback: (payload: {
    data: {
      message_id: string
    }
    from: string
    messageId: string
    notification: {
      body: string
      title: string
    }
  }) => void
) {
  return onMessage(messaging, callback as any)
}
