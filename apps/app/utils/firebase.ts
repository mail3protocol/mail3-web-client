import { initializeApp } from 'firebase/app'
import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage,
} from 'firebase/messaging'
import { FirebaseApp } from '@firebase/app'
import { Messaging } from '@firebase/messaging'
import {
  FIREBASE_CONFIG,
  FIREBASE_MESSAGING_VAPID_KEY,
} from '../constants/env/firebase'

class FirebaseUtils {
  readonly app?: FirebaseApp

  readonly messaging?: Messaging

  constructor() {
    try {
      this.app = initializeApp(FIREBASE_CONFIG)
      this.messaging = getMessaging(this.app)
    } catch (err) {
      console.log('Failed to initialize Firebase Messaging', err)
    }
  }

  getFirebaseMessagingToken() {
    if (!this.messaging) return ''
    return getToken(this.messaging, {
      vapidKey: FIREBASE_MESSAGING_VAPID_KEY,
    })
  }

  deleteFirebaseMessagingToken() {
    if (!this.messaging) return false
    return deleteToken(this.messaging)
  }

  onFirebaseMessage(
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
    return this.messaging ? onMessage(this.messaging, callback as any) : null
  }
}

const utils = new FirebaseUtils()
const {
  getFirebaseMessagingToken,
  deleteFirebaseMessagingToken,
  onFirebaseMessage,
} = utils

export {
  getFirebaseMessagingToken,
  deleteFirebaseMessagingToken,
  onFirebaseMessage,
}
