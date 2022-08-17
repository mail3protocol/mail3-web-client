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
  const [permission, setPermission] = useState(getNotificationPermission())
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
      if (state !== 'enabled') {
        await onDeleteFCMToken()
      } else {
        await getFCMToken()
      }
    },
    []
  )

  const onSwitchWebPushNotificationState = useCallback(
    async (state: 'enabled' | 'disabled') => {
      if (isSwitchingWebPushNotificationState) return
      setIsSwitchingWebPushNotificationState(true)
      try {
        const isCurrentState = await api
          .getUserInfo()
          .then((res) => res.data.web_push_notification_state === state)
        if (!isCurrentState) {
          await api.switchUserWebPushNotification()
          setUserInfo((info) => ({
            ...info,
            web_push_notification_state: state,
          }))
        }
        await onLoadMessagingToken(state)
      } catch (err) {
        console.error(err)
      } finally {
        setIsSwitchingWebPushNotificationState(false)
      }
    },
    [api]
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
