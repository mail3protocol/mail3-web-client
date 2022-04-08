import { Button, useDisclosure } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { CurrentConnector } from '../../connectors'
import { useDidMount } from '../../hooks/useDidMount'
import { truncateMiddle } from '../../utils'
import { ConenctModal } from './ConnectModal'

const { usePriorityConnector, usePriorityIsActivating, usePriorityAccount } =
  CurrentConnector

export const ConnectWallet: React.FC = () => {
  const [t] = useTranslation('connect')
  const connector = usePriorityConnector()
  const IsActivating = usePriorityIsActivating()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const account = usePriorityAccount()

  useDidMount(() => {
    connector.connectEagerly?.()
  })

  return (
    <>
      {account ? (
        <Button
          onClick={() => {
            // eslint-disable-next-line no-alert
            const isLogout = confirm('logout?')
            if (isLogout) {
              connector.deactivate()
            }
          }}
        >
          {truncateMiddle(account, 6, 4)}
        </Button>
      ) : (
        <Button
          onClick={() => {
            onOpen()
          }}
          isDisabled={IsActivating}
          isLoading={IsActivating}
        >
          {IsActivating ? t('connecting') : t('connect-wallet')}
        </Button>
      )}
      <ConenctModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
