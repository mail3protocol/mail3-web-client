import { useCallback, useEffect, useState } from 'react'
import { defer, from, fromEvent, switchMap } from 'rxjs'
import { useQuery } from 'react-query'
import { useAtom } from 'jotai'
import { useToast } from 'hooks'
import { IS_CHROME, IS_FIREFOX, IS_MOBILE } from '../constants/utils'
import { getNotificationPermission, userPropertiesAtom } from './useLogin'
import { useAPI } from './useAPI'
import { useDeleteFCMToken, useGetFCMToken } from './useFCMToken'

export function useNotification(shouldReload = true) {
  const { data: isBrowserSupport, isLoading: isCheckingBrowserSupport } =
    useQuery(
      ['isSupportedFCM'],
      async () => {
        const { isSupported } = await import('firebase/messaging')
        return (
          (await isSupported()) && IS_CHROME() && !IS_MOBILE() && !IS_FIREFOX()
        )
      },
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    )
  const [permission, setPermission] = useState<
    NotificationPermission | PermissionState
  >(getNotificationPermission())
  const [
    isSwitchingWebPushNotificationState,
    setIsSwitchingWebPushNotificationState,
  ] = useState(false)
  const [userInfo, setUserInfo] = useAtom(userPropertiesAtom)
  const api = useAPI()
  const webPushNotificationState = userInfo?.notification_state || 'disabled'
  const deleteFCMToken = useDeleteFCMToken()
  const getFCMToken = useGetFCMToken()
  const toast = useToast()

  const onSwitchWebPushNotificationState = useCallback(
    async (state: 'enabled' | 'disabled') => {
      if (isSwitchingWebPushNotificationState) return
      setIsSwitchingWebPushNotificationState(true)
      try {
        if (state === 'disabled') {
          await deleteFCMToken()
        } else if (state === 'enabled') {
          await getFCMToken()
        }
        await api.switchUserWebPushNotification(
          state === 'enabled' ? 'active' : 'stale'
        )
        setUserInfo((info) => ({
          ...info,
          notification_state: state,
        }))
        setIsSwitchingWebPushNotificationState(false)
      } catch (err) {
        setIsSwitchingWebPushNotificationState(false)
        console.error(err)
        const message = (err as any)?.message as any
        toast(message, {
          status: 'error',
        })
        throw err
      }
    },
    [
      api,
      isSwitchingWebPushNotificationState,
      setIsSwitchingWebPushNotificationState,
      setUserInfo,
      deleteFCMToken,
      getFCMToken,
    ]
  )

  const openNotification = useCallback(async () => {
    // eslint-disable-next-line compat/compat
    if (window.Notification.permission === 'default') {
      // eslint-disable-next-line compat/compat
      await window.Notification.requestPermission()
      return
    }
    await onSwitchWebPushNotificationState('enabled')
  }, [onSwitchWebPushNotificationState])

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
          if (newPermission === 'granted') {
            await onSwitchWebPushNotificationState('enabled')
            if (shouldReload) {
              location.reload()
            }
          }
          setPermission(newPermission)
        })
    }
    return null
  }

  async function checkTokenStatus() {
    const { createStore, get, keys } = await import('idb-keyval')
    const store = createStore(
      'firebase-messaging-database',
      'firebase-messaging-store'
    )
    const currentKeys = await keys(store)
    const token =
      currentKeys.length > 0
        ? ((await get(currentKeys[0], store))?.token as string)
        : undefined
    if (!token) {
      await onSwitchWebPushNotificationState('enabled')
      return
    }
    const currentTokenState = await api
      .getRegistrationTokenState(token)
      .then((res) => res.data.state)
      .catch(() => 'stale')
    if (currentTokenState === 'stale') {
      await api.updateRegistrationToken(token, 'active')
    }
  }

  useEffect(() => {
    checkTokenStatus()
    const s = onSubscribeNavigatorPermissions()
    return () => {
      s?.unsubscribe()
    }
  }, [])

  return {
    permission,
    isBrowserSupport,
    isBrowserSupportChecking: isCheckingBrowserSupport,
    openNotification,
    webPushNotificationState,
  }
}
