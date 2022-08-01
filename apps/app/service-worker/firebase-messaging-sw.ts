import firebase from 'firebase/compat'
import { FIREBASE_CONFIG } from '../constants/firebase'

firebase.initializeApp(FIREBASE_CONFIG)
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || ''
  const notificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.image,
  }
  // @ts-ignore
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  )
})
