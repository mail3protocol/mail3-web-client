import { useTranslation } from 'react-i18next'
import React, { useEffect, useState, useMemo } from 'react'
import { useDidMount } from 'hooks'
import { Button } from 'ui/src/Button'
import {
  ConnectWallet as ConnectWalletButton,
  ConnectWalletProps,
  ConnectWalletApiContext,
  coinbase,
  coinbaseStore,
  ConnectorName,
  useAccount,
  useConnectWalletDialog,
  useEagerConnect,
} from 'connect-wallet'
import { isCoinbaseWallet } from '../../utils'
import { useEthButton } from '../../hooks/useEthButton'
import { NoOnWhiteListError, useRemember } from '../../hooks/useRemember'
import {
  useIsAuthenticated,
  useOpenAuthModal,
  useUnstoppable,
} from '../../hooks/useLogin'
import { UD_CLIENT_ID, UD_REDIRECT_URI } from '../../constants'

export const ConnectWalletApiContextProvider: React.FC = ({ children }) => {
  const isAuth = useIsAuthenticated()
  const { onRemember, isLoading: isRemembering } = useRemember()
  const openAuthModal = useOpenAuthModal()
  const { setUnstoppableUserInfo, unstoppableUserInfo, setIsConnectingUD } =
    useUnstoppable()
  const providerValue = useMemo(
    () => ({
      onRemember,
      isRemembering,
      isAuth,
      udClientId: UD_CLIENT_ID,
      udRedirectUri: UD_REDIRECT_URI,
      openAuthModal,
      setUnstoppableUserInfo,
      unstoppableUserInfo,
      setIsConnectingUD,
    }),
    [
      onRemember,
      isRemembering,
      isAuth,
      UD_CLIENT_ID,
      UD_REDIRECT_URI,
      openAuthModal,
      setUnstoppableUserInfo,
      unstoppableUserInfo,
      setIsConnectingUD,
    ]
  )

  return (
    <ConnectWalletApiContext.Provider value={providerValue}>
      {children}
    </ConnectWalletApiContext.Provider>
  )
}

export interface ConnectWalletWithCoinbaseProps
  extends Omit<ConnectWalletProps, 'renderConnected'> {
  isAuth: boolean
  account: string
}

const ConnectWalletWithCoinbase: React.FC<ConnectWalletWithCoinbaseProps> = ({
  isAuth,
  account,
  onSignError,
  ...props
}) => {
  const [t] = useTranslation('common')
  const { onClick, isConnecting } = useEthButton({
    connectorName: ConnectorName.Coinbase,
    connector: coinbase,
    store: coinbaseStore,
  })
  const { onRemember, isLoading } = useRemember()
  const onSignToLogin = () =>
    onRemember().catch((error) => {
      if (error instanceof NoOnWhiteListError) {
        onSignError?.(error)
      }
    })

  const isConnectedWithoutSigned = account && !isAuth
  useEffect(() => {
    if (!isConnectedWithoutSigned) {
      onClick()
    }
  }, [isConnectedWithoutSigned])

  return (
    <Button
      onClick={isConnectedWithoutSigned ? onSignToLogin : onClick}
      w="200px"
      loadingText={t('connect.connecting')}
      isLoading={isConnecting || isLoading}
      {...props}
    >
      {t('connect.connect-wallet')}
    </Button>
  )
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  renderConnected,
  onSignError,
  ...props
}) => {
  const account = useAccount()
  const isAuth = useIsAuthenticated()
  const [signError, setSignError] = useState<NoOnWhiteListError | null>(null)
  const { onOpen } = useConnectWalletDialog()
  const isRedirectFromUD =
    location.hash.includes('code') && location.hash.includes('openid%20wallet')

  useDidMount(() => {
    if (isRedirectFromUD) {
      onOpen()
    }
  })

  useEagerConnect()

  if (isCoinbaseWallet() && !signError) {
    if (!isAuth) {
      return (
        <ConnectWalletWithCoinbase
          isAuth={isAuth}
          account={account}
          onSignError={(err) => {
            setSignError(err)
            onSignError?.(err)
          }}
          {...props}
        />
      )
    }
  }

  return (
    <ConnectWalletApiContextProvider>
      <ConnectWalletButton renderConnected={renderConnected} {...props} />
    </ConnectWalletApiContextProvider>
  )
}
