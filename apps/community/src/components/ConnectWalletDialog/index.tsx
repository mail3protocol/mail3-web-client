import React from 'react'
import { useAtomValue } from 'jotai/utils'
import {
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { CloseButton } from '../ConfirmDialog'
import { SelectConnectWallet } from './SelectConnectWallet'
import {
  isOpenConnectWalletDialogAtom,
  useCloseConnectWalletDialog,
} from '../../hooks/useConnectWalletDialog'

export const ConnectWalletDialog: React.FC = () => {
  const isAuthModalOpen = useAtomValue(isOpenConnectWalletDialogAtom)
  const onCloseAuthDialog = useCloseConnectWalletDialog()
  const { t } = useTranslation('common')

  return (
    <Modal
      size="lg"
      autoFocus={false}
      isOpen={isAuthModalOpen}
      onClose={onCloseAuthDialog}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <CloseButton onClick={onCloseAuthDialog} />
        <ModalBody>
          <Heading as="h3" fontSize="18px" mb="24px">
            {t('connect_wallet')}
          </Heading>
          <SelectConnectWallet />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
