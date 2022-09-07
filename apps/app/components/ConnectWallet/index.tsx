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
import { timer } from 'rxjs'
import { Navigate, useLocation } from 'react-router-dom'
import { ConnectModalWithMultichain } from './ConnectModalWithMultichain'
import { isCoinbaseWallet } from '../../utils'
import { useEthButton } from '../../hooks/useEthButton'
import { useIsAuthenticated } from '../../hooks/useLogin'
import { useRemember } from '../../hooks/useRemember'
import { RoutePath } from '../../route/path'

export interface ConnectWalletProps extends ButtonProps {
  renderConnected: (address: string) => React.ReactNode
}

const ConnectWalletWithCoinbase: React.FC<
  ButtonProps & { isAuth: boolean; account: string }
> = ({ isAuth, account, ...props }) => {
  const [t] = useTranslation('common')
  const { onClick, isConnecting } = useEthButton({
    connectorName: ConnectorName.Coinbase,
    connector: coinbase,
    store: coinbaseStore,
  })
  const { onRemember, isLoading } = useRemember()
  const [accountTemp, setAccountTemp] = useState(account)
  useEffect(() => {
    if (isCoinbaseWallet() && account && !isAuth) {
      onRemember()
    }
  }, [])
  useEffect(() => {
    if (!accountTemp && account && !isAuth) {
      const timeoutSubscriber = timer(1000).subscribe(() => {
        onRemember()
      })
      return () => {
        timeoutSubscriber.unsubscribe()
      }
    }
    setAccountTemp(account)
    return () => {}
  }, [account])

  return (
    <Button
      onClick={account && !isAuth ? onRemember : onClick}
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
  ...props
}) => {
  const [t] = useTranslation('common')
  const { isOpen, onOpen, onClose } = useConnectWalletDialog()
  const account = useAccount()
  const isAuth = useIsAuthenticated()

  useEagerConnect()

  useEffect(() => {
    if (isCoinbaseWallet() && isAuth && account) {
    }
  }, [])

  const { pathname } = useLocation()
  if (isCoinbaseWallet()) {
    if (!isAuth) {
      return (
        <ConnectWalletWithCoinbase
          isAuth={isAuth}
          account={account}
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
