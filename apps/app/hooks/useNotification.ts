import { useCallback, useEffect, useState } from 'react'
import { useUpdateAtom } from 'jotai/utils'
import { getIsEnabledNotification, userPropertiesAtom } from './useLogin'

export const getNotificationPermission = () =>
  // eslint-disable-next-line compat/compat
  Notification?.permission || 'default'

export function useNotification(updatePermissionDeps?: any[]) {
  const setUserInfo = useUpdateAtom(userPropertiesAtom)
  const [permission, setPermission] = useState(getNotificationPermission())

  useEffect(() => {
    setPermission(getNotificationPermission())
  }, [...(updatePermissionDeps || [])])

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
