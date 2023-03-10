import { useCallback, useEffect, useState } from 'react'
import { defer, from, fromEvent, switchMap } from 'rxjs'
import { useQuery } from 'react-query'
import { useAtom } from 'jotai'
import { useToast } from 'hooks'
import { atomWithStorage } from 'jotai/utils'
import { IS_CHROME, IS_FIREFOX, IS_MOBILE } from '../constants/utils'
import { getNotificationPermission, userPropertiesAtom } from './useLogin'
import { useAPI } from './useAPI'
import { useDeleteFCMToken, useGetFCMToken } from './useFCMToken'

const isCheckedTokenStatusAtom = atomWithStorage(
  'is_checked_notification_token_status',
  false,
  {
    removeItem(key: string) {
      return sessionStorage.removeItem(key)
    },
    getItem(key) {
      return sessionStorage.getItem(key) === 'true'
    },
    setItem(key, value) {
      return sessionStorage.setItem(key, value ? 'true' : 'false')
    },
  }
)

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
  const [isCheckedTokenStatus, setIsCheckedTokenStatus] = useAtom(
    isCheckedTokenStatusAtom
  )

  const onSwitchWebPushNotificationState = useCallback(
    async (state: 'enabled' | 'disabled') => {
      if (isSwitchingWebPushNotificationState) return
      setIsSwitchingWebPushNotificationState(true)
      try {
        await api.switchUserWebPushNotification(
          state === 'enabled' ? 'active' : 'stale'
        )
        setUserInfo((info) => ({
          ...info,
          notification_state: state,
        }))
        if (state === 'disabled') {
          await deleteFCMToken()
        } else if (state === 'enabled') {
          await getFCMToken()
        }
        setIsSwitchingWebPushNotificationState(false)
      } catch (err) {
        setIsSwitchingWebPushNotificationState(false)
        console.error(err)
        const message = (err as any)?.message as string
        if (!message.includes('Registration failed')) {
          toast(message, {
            status: 'error',
          })
        }
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
    const p = window.Notification.permission
    if (p === 'default') {
      // eslint-disable-next-line compat/compat
      return window.Notification.requestPermission()
    }
    await onSwitchWebPushNotificationState('enabled')
    return p
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
          setPermission(newPermission)
          if (newPermission === 'granted') {
            await onSwitchWebPushNotificationState('enabled')
            if (shouldReload) {
              location.reload()
            }
          }
        })
    }
    return null
  }

  async function checkTokenStatus() {
    if (
      webPushNotificationState === 'disabled' ||
      window.Notification.permission !== 'granted'
    ) {
      return
    }
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
    if (isCheckedTokenStatus) return
    setIsCheckedTokenStatus(true)
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
