import { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { defer, from, fromEvent, switchMap } from 'rxjs'
import {
  getIsEnabledNotification,
  getNotificationPermission,
  userPropertiesAtom,
} from './useLogin'
import { useAPI } from './useAPI'
import {
  getCurrentToken,
  useDeleteFCMToken,
  useGetFCMToken,
} from './useFCMToken'
import { onFirebaseMessage } from '../utils/firebase'

export function useNotification(options?: {
  onChangePermission?: (permission: NotificationPermission) => void
}) {
  const api = useAPI()
  const [userInfo, setUserInfo] = useAtom(userPropertiesAtom)
  const [permission, setPermission] = useState(getNotificationPermission())
  const [
    isSwitchingWebPushNotificationState,
    setIsSwitchingWebPushNotificationState,
  ] = useState(false)
  const webPushNotificationState: 'enabled' | 'disabled' =
    userInfo?.web_push_notification_state || 'disabled'
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
        const isCurrentState =
          (await api.getUserInfo()).data.web_push_notification_state === state
        if (isCurrentState) return
        await api.switchUserWebPushNotification()
        setUserInfo((info) => ({
          ...info,
          web_push_notification_state: state,
        }))
        await onLoadMessagingToken(state)
      } catch (err) {
        console.error(err)
      } finally {
        setIsSwitchingWebPushNotificationState(false)
      }
    },
    [api]
  )

  function onFirebaseMessageListener() {
    return onFirebaseMessage((payload) => {
      // eslint-disable-next-line compat/compat
      const notification = new Notification(payload.notification.title, {
        body: payload.notification.body,
      })
      notification.onclick = () => {
        window.open(
          `${location.origin}/message/${payload.data.message_id}`,
          '_blank'
        )
      }
    })
  }

  function onCheckNotificationStatus() {
    if (
      userInfo?.web_push_notification_state !== 'enabled' ||
      permission !== 'granted'
    )
      return null
    return getCurrentToken().then(async (tokenItem) => {
      if (tokenItem) {
        const state = await api
          .getRegistrationTokenState(tokenItem.token)
          .then((r) => r.data.state)
          .catch(() => null)
        if (state === 'stale') {
          await api.updateRegistrationToken(tokenItem.token, 'active')
        }
        if (state) {
          return null
        }
      }
      return getFCMToken()
    })
  }

  function onSubscribeNavigatorPermissions() {
    if ('permissions' in navigator) {
      return defer(() =>
        from(navigator.permissions.query({ name: 'notifications' }))
      )
        .pipe(
          switchMap((notificationPerm) => fromEvent(notificationPerm, 'change'))
        )
        .subscribe((event) => {
          const target = event.target as PermissionStatus
          const newPermission = target.state as NotificationPermission
          setPermission(newPermission)
          options?.onChangePermission?.(newPermission)
          setUserInfo((info) => ({
            ...info,
            ...getIsEnabledNotification(newPermission),
          }))
          onSwitchWebPushNotificationState(
            newPermission === 'granted' ? 'enabled' : 'disabled'
          )
        })
    }
    return null
  }

  useEffect(() => {
    onCheckNotificationStatus()
    const navigatorPermissionsSubscriber = onSubscribeNavigatorPermissions()
    const firebaseMessageListener = onFirebaseMessageListener()
    return () => {
      navigatorPermissionsSubscriber?.unsubscribe()
      firebaseMessageListener()
    }
  }, [])

  const requestPermission = useCallback(async () => {
    // eslint-disable-next-line compat/compat
    const newPermission = await Notification.requestPermission()
    setPermission(newPermission)
    return newPermission
  }, [setPermission])

  return {
    requestPermission,
    permission,
    webPushNotificationState,
  }
}
