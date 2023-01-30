import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { ConfirmDialog, useDidMount } from 'hooks'
import { ButtonProps } from '@chakra-ui/react'
import { isCoinbaseWallet } from 'shared/src/env'
import { Button } from 'ui/src/Button'
import {
  coinbase,
  coinbaseStore,
  ConnectorName,
  useAccount,
  useConnectWalletDialog,
  useEagerConnect,
} from './connectors'
import {
  ConnectModalWithMultichain,
  ConnectWalletSelector,
} from './ConnectModalWithMultichain'
import { useEthButton } from './useEthButton'
import { useConnectWalletApi } from './ConnectWalletApiContext'

export interface ConnectWalletProps extends ButtonProps {
  renderConnected: (address: string) => React.ReactNode
  onSignError?: (error: Error) => void
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
  const { onRemember, isRemembering } = useConnectWalletApi()
  const isConnectedWithoutSigned = account && !isAuth
  useEffect(() => {
    if (!isConnectedWithoutSigned) {
      onClick()
    }
  }, [isConnectedWithoutSigned])

  return (
    <Button
      onClick={isConnectedWithoutSigned ? onRemember : onClick}
      w="200px"
      loadingText={t('connect.connecting')}
      isLoading={isConnecting || isRemembering}
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
  const { isAuth } = useConnectWalletApi()
  const [signError, setSignError] = useState<Error | null>(null)

  useEagerConnect()

  const isRedirectFromUD =
    location.hash.includes('code') && location.hash.includes('openid%20wallet')

  useDidMount(() => {
    if (isRedirectFromUD) {
      onOpen()
    }
  })

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

export { ConnectWalletApiContext } from './ConnectWalletApiContext'
export { AuthModal } from './AuthModal'
export { ConnectModalWithMultichain, ConnectWalletSelector }
export * from './connectors'
export * from './useSignMessage'
export * from './useSignup'
