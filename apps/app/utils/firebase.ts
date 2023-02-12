// import { initializeApp } from 'firebase/app'
// import {
//   getMessaging,
//   getToken,
//   deleteToken,
//   onMessage,
// } from 'firebase/messaging'
import type { FirebaseApp } from '@firebase/app'
import type { Messaging } from '@firebase/messaging'
import {
  FIREBASE_CONFIG,
  FIREBASE_MESSAGING_VAPID_KEY,
} from '../constants/env/firebase'

export class FirebaseUtils {
  readonly app?: FirebaseApp

  readonly messaging?: Messaging

  static self?: FirebaseUtils // Singleton

  constructor(app: FirebaseApp, messaging: Messaging) {
    this.app = app
    this.messaging = messaging
  }

  // eslint-disable-next-line consistent-return
  public static async create() {
    if (FirebaseUtils.self) return FirebaseUtils.self as FirebaseUtils
    const { initializeApp } = await import('firebase/app')
    const { getMessaging } = await import('firebase/messaging')
    const app = initializeApp(FIREBASE_CONFIG)
    const messaging = getMessaging(app)
    FirebaseUtils.self = new FirebaseUtils(app, messaging)
    return FirebaseUtils.self
  }

  async getFirebaseMessagingToken() {
    if (!this.messaging) return ''
    const { getToken } = await import('firebase/messaging')
    return getToken(this.messaging, {
      vapidKey: FIREBASE_MESSAGING_VAPID_KEY,
    })
  }

  async deleteFirebaseMessagingToken() {
    if (!this.messaging) return false
    const { deleteToken } = await import('firebase/messaging')
    return deleteToken(this.messaging)
  }

  // onFirebaseMessage(
  //   callback: (payload: {
  //     data: {
  //       message_id: string
  //     }
  //     from: string
  //     messageId: string
  //     notification: {
  //       body: string
  //       title: string
  //     }
  //   }) => void
  // ) {
  //   return this.messaging ? onMessage(this.messaging, callback as any) : null
  // }
}
