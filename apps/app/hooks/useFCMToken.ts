import { useCallback } from 'react'
import {
  createStore,
  get as getDataByIndexedDb,
  keys as getIndexedDbKeys,
} from 'idb-keyval'
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import { useAccount } from 'hooks'
import { useAPI } from './useAPI'
import {
  deleteFirebaseMessagingToken,
  getFirebaseMessagingToken,
} from '../utils/firebase'

export const FirebaseMessagingStore = createStore(
  'firebase-messaging-database',
  'firebase-messaging-store'
)

export const TokenStateMapAtom = atomWithStorage<{
  [address in string]: { [token in string]?: 'stale' | 'active' }
}>('firebase_token_state_map', {})

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

export function useTokenStateMap() {
  const account = useAccount()
  const [tokenStateMap, setTokenStateMap] = useAtom(TokenStateMapAtom)
  const getTokenState = (token: string) => tokenStateMap[account]?.[token]
  const updateTokenState = (token: string, state: 'stale' | 'active') =>
    setTokenStateMap((m) => ({
      ...m,
      [account]: { ...m[account], [token]: state },
    }))
  return {
    getTokenState,
    updateTokenState,
  }
}

export function useDeleteFCMToken() {
  const api = useAPI()
  const { getTokenState, updateTokenState } = useTokenStateMap()
  return useCallback(async () => {
    const currentTokenItem = await getCurrentToken()
    if (currentTokenItem && getTokenState(currentTokenItem.token) !== 'stale') {
      await api
        .updateRegistrationToken(currentTokenItem.token, 'stale')
        .catch(console.error)
      updateTokenState(currentTokenItem.token, 'stale')
    }
    await deleteFirebaseMessagingToken().catch(console.error)
  }, [api])
}

export function useGetFCMToken() {
  const api = useAPI()
  const { getTokenState, updateTokenState } = useTokenStateMap()
  return useCallback(async () => {
    const token = await getFirebaseMessagingToken()
    if (getTokenState(token) === 'active') return token
    await api.updateRegistrationToken(token, 'active')
    updateTokenState(token, 'active')
    return token
  }, [api])
}
