import { useCallback } from 'react'
import {
  createStore,
  get as getDataByIndexedDb,
  keys as getIndexedDbKeys,
} from 'idb-keyval'
import { useAPI } from './useAPI'
import {
  deleteFirebaseMessagingToken,
  getFirebaseMessagingToken,
} from '../utils/firebase'

export const FirebaseMessagingStore = createStore(
  'firebase-messaging-database',
  'firebase-messaging-store'
)

export async function getCurrentToken() {
  const [currentTokenKey] = await getIndexedDbKeys(FirebaseMessagingStore)
  if (!currentTokenKey) return null
  return getDataByIndexedDb<{
    token: string
    createTime: number
    subscriptionOptions: {
      auth: string
      endpoint: string
      p256dh: string
      swScope: string
      vapidKey: string
    }
  }>(currentTokenKey, FirebaseMessagingStore)
}

export function useDeleteFCMToken() {
  const api = useAPI()
  return useCallback(async () => {
    const currentTokenItem = await getCurrentToken()
    if (currentTokenItem) {
      await api
        .updateRegistrationToken(currentTokenItem.token, 'stale')
        .catch(console.error)
    }
    await deleteFirebaseMessagingToken().catch(console.error)
  }, [api])
}

export function useGetFCMToken() {
  const api = useAPI()
  return useCallback(async () => {
    const token = await getFirebaseMessagingToken()
    const currentServerNotificationState = await api
      .getRegistrationTokenState(token)
      .then((res) => res.data.state)
      .catch(() => 'stale')
    if (currentServerNotificationState === 'active') {
      return token
    }
    await api.updateRegistrationToken(token, 'active')
    return token
  }, [api])
}
