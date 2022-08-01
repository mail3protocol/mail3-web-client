import { useCallback, useEffect, useState } from 'react'
import { useUpdateAtom, atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import {
  getIsEnabledNotification,
  getNotificationPermission,
  userPropertiesAtom,
} from './useLogin'
import {
  deleteFirebaseMessagingToken,
  getFirebaseMessagingToken,
} from '../utils/firebase'

const FirebaseMessagingTimeoutAtom = atomWithStorage<string | null>(
  'firebase_messaging_timeout',
  null
)

export function useNotification(options?: {
  onChangePermission?: (permission: NotificationPermission) => void
}) {
  const setUserInfo = useUpdateAtom(userPropertiesAtom)
  const [permission, setPermission] = useState(getNotificationPermission())
  const [firebaseMessagingTimeout, setFirebaseMessagingTimeout] = useAtom(
    FirebaseMessagingTimeoutAtom
  )

  const onLoadMessagingToken = useCallback(async () => {
    await deleteFirebaseMessagingToken()
    await getFirebaseMessagingToken()
    setFirebaseMessagingTimeout(dayjs().add(15, 'day').toISOString())
  }, [])

  useEffect(() => {
    if (dayjs().isAfter(dayjs(firebaseMessagingTimeout))) {
      onLoadMessagingToken()
    }
  }, [firebaseMessagingTimeout])

  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'notifications' })
        .then((notificationPerm) => {
          // eslint-disable-next-line no-param-reassign
          notificationPerm.onchange = async () => {
            const newPermission = getNotificationPermission()
            setPermission(getNotificationPermission())
            options?.onChangePermission?.(newPermission)
            await onLoadMessagingToken()
          }
        })
    }
  })

  useEffect(() => {
    setUserInfo((info) => ({
      ...info,
      ...getIsEnabledNotification(permission),
    }))
  }, [permission])

  const requestPermission = useCallback(async () => {
    // eslint-disable-next-line compat/compat
    const newPermission = await Notification.requestPermission()
    setPermission(newPermission)
    return newPermission
  }, [setPermission])

  return {
    requestPermission,
    permission,
  }
}
