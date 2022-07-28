import { useCallback, useEffect, useState } from 'react'
import { useUpdateAtom } from 'jotai/utils'
import {
  getIsEnabledNotification,
  getNotificationPermission,
  userPropertiesAtom,
} from './useLogin'

export function useNotification(options?: {
  onChangePermission?: (permission: NotificationPermission) => void
}) {
  const setUserInfo = useUpdateAtom(userPropertiesAtom)
  const [permission, setPermission] = useState(getNotificationPermission())

  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'notifications' })
        .then((notificationPerm) => {
          // eslint-disable-next-line no-param-reassign
          notificationPerm.onchange = () => {
            const newPermission = getNotificationPermission()
            setPermission(getNotificationPermission())
            options?.onChangePermission?.(newPermission)
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
