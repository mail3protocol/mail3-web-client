// register: https://firebase.google.com/

export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBSAE_CONFIG_API_KEY || 'api-key',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBSAE_CONFIG_AUTH_DOMAIN ||
    'project-id.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBSAE_CONFIG_PROJECT_ID || 'project-id',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBSAE_CONFIG_STORAGE_BUCKET ||
    'project-id.appspot.com',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBSAE_CONFIG_MESSAGE_SENDER_ID || 'sender-id',
  appId: process.env.NEXT_PUBLIC_FIREBSAE_CONFIG_APP_ID || 'app-id',
}

export const FIREBASE_MESSAGING_VAPID_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY || 'vapid_key'
