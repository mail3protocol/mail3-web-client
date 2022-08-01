import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, deleteToken } from 'firebase/messaging'
import {
  FIREBASE_CONFIG,
  FIREBASE_MESSAGING_VAPID_KEY,
} from '../constants/firebase'

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
