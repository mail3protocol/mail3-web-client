import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import {
  coinbase,
  coinbaseStore,
  ConfirmDialog,
  ConnectorName,
  useAccount,
  useConnectWalletDialog,
  useEagerConnect,
} from 'hooks'
import { Button } from 'ui/src/Button'
import { ButtonProps } from '@chakra-ui/react'
import { Navigate, useLocation } from 'react-router-dom'
import { ConnectModalWithMultichain } from './ConnectModalWithMultichain'
import { isCoinbaseWallet } from '../../utils'
import { useEthButton } from '../../hooks/useEthButton'
import { useIsAuthenticated } from '../../hooks/useLogin'
import { NoOnWhiteListError, useRemember } from '../../hooks/useRemember'
import { RoutePath } from '../../route/path'

export interface ConnectWalletProps extends ButtonProps {
  renderConnected: (address: string) => React.ReactNode
  onSignError?: (error: NoOnWhiteListError) => void
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
  const [t] = useTranslation('common')
  const { isOpen, onOpen, onClose } = useConnectWalletDialog()
  const account = useAccount()
  const isAuth = useIsAuthenticated()
  const [signError, setSignError] = useState<NoOnWhiteListError | null>(null)

  useEagerConnect()

  const { pathname } = useLocation()
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
    if (pathname === RoutePath.Testing) {
      return <Navigate to={RoutePath.Inbox} replace />
    }
  }

  return (
    <>
      {account ? (
        renderConnected(account)
      ) : (
        <Button
          onClick={onOpen}
          w="200px"
          loadingText={t('connect.connecting')}
          {...props}
        >
          {t('connect.connect-wallet')}
        </Button>
      )}
      <ConfirmDialog />
      <ConnectModalWithMultichain isOpen={isOpen} onClose={onClose} />
    </>
  )
}
