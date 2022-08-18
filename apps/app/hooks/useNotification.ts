import { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { defer, from, fromEvent, switchMap } from 'rxjs'
import {
  getIsEnabledNotification,
  getNotificationPermission,
  userPropertiesAtom,
} from './useLogin'
import { useAPI } from './useAPI'
import { useDeleteFCMToken, useGetFCMToken } from './useFCMToken'

export function useNotification() {
  const api = useAPI()
  const [userInfo, setUserInfo] = useAtom(userPropertiesAtom)
  const [permission, setPermission] = useState<
    NotificationPermission | PermissionState
  >(getNotificationPermission())
  const [
    isSwitchingWebPushNotificationState,
    setIsSwitchingWebPushNotificationState,
  ] = useState(false)
  const webPushNotificationState: 'enabled' | 'disabled' =
    userInfo?.notification_state || 'disabled'
  const onDeleteFCMToken = useDeleteFCMToken()
  const getFCMToken = useGetFCMToken()

  const onLoadMessagingToken = useCallback(
    async (state: 'enabled' | 'disabled') => {
      if (state === 'disabled') {
        await onDeleteFCMToken()
      } else if (state === 'enabled') {
        await getFCMToken()
      }
    },
    [getFCMToken, onDeleteFCMToken]
  )

  const onSwitchWebPushNotificationState = useCallback(
    async (state: 'enabled' | 'disabled') => {
      if (isSwitchingWebPushNotificationState) return
      setIsSwitchingWebPushNotificationState(true)
      try {
        await onLoadMessagingToken(state)
        await api.switchUserWebPushNotification(
          state === 'enabled' ? 'active' : 'stale'
        )
        setUserInfo((info) => ({
          ...info,
          notification_state: state,
        }))
      } catch (err) {
        console.error(err)
      } finally {
        setIsSwitchingWebPushNotificationState(false)
      }
    },
    [
      api,
      isSwitchingWebPushNotificationState,
      setIsSwitchingWebPushNotificationState,
      onLoadMessagingToken,
      setUserInfo,
    ]
  )

  async function onCheckNotificationStatus() {
    if (permission === 'granted' && webPushNotificationState === 'enabled') {
      await onSwitchWebPushNotificationState('enabled')
    }
  }

  async function onChangePermission(newPermission: NotificationPermission) {
    setPermission(newPermission)
    setUserInfo((info) => ({
      ...info,
      ...getIsEnabledNotification(newPermission),
    }))
    await onSwitchWebPushNotificationState(
      newPermission === 'granted' ? 'enabled' : 'disabled'
    )
  }

  function onSubscribeNavigatorPermissions() {
    if ('permissions' in navigator) {
      return defer(() =>
        from(navigator.permissions.query({ name: 'notifications' }))
      )
        .pipe(
          switchMap((notificationPerm) => fromEvent(notificationPerm, 'change'))
        )
        .subscribe(async (event) => {
          const target = event.target as PermissionStatus
          const newPermission = target.state as NotificationPermission
          await onChangePermission(target.state as NotificationPermission)
          if (newPermission === 'granted') {
            location.reload()
          }
        })
    }
    return null
  }

  useEffect(() => {
    onCheckNotificationStatus()
    const navigatorPermissionsSubscriber = onSubscribeNavigatorPermissions()
    return () => {
      navigatorPermissionsSubscriber?.unsubscribe()
    }
  }, [])

  const requestPermission = useCallback(async () => {
    // eslint-disable-next-line compat/compat
    const newPermission = await Notification.requestPermission()
    await onChangePermission(newPermission)
    return newPermission
  }, [setPermission])

  return {
    requestPermission,
    onChangePermission,
    permission,
    webPushNotificationState,
  }
}
