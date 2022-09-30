import { useTranslation } from 'react-i18next'
import {
  Button,
  Flex,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { truncateMiddle } from 'shared'
import React from 'react'
import { useAccount } from 'hooks'
import { ReactComponent as WalletSvg } from 'assets/svg/wallet.svg'
import { useAtomValue } from 'jotai/utils'
import { useRemember } from '../../hooks/useRemember'
import { CloseButton } from '../ConfirmDialog'
import {
  isAuthModalOpenAtom,
  useCloseAuthModal,
} from '../../hooks/useAuthDialog'

export const AuthContent: React.FC = () => {
  const { t } = useTranslation(['components', 'common'])
  const account = useAccount()
  const { onRemember, isLoading } = useRemember()
  const onCloseAuthDialog = useCloseAuthModal()

  return (
    <>
      <Heading as="h3" fontSize="18px" mb="24px">
        {t('connect_wallet', { ns: 'common' })}
      </Heading>
      <Text>{t('auth_connect_wallet.description')}</Text>
      <Flex
        w="100%"
        align="center"
        justify="space-between"
        bg="containerBackground"
        rounded="100px"
        px="20px"
        lineHeight="40px"
        mt="20px"
      >
        <Text fontWeight={600} fontSize="16px">
          {truncateMiddle(account, 6, 4)}
        </Text>
        <Icon as={WalletSvg} w="24px" h="24px" />
      </Flex>
      <Button
        isFullWidth
        mt="20px"
        variant="solid-rounded"
        colorScheme="primaryButton"
        isLoading={isLoading}
        onClick={async () => {
          await onRemember()
          onCloseAuthDialog()
        }}
      >
        {t('auth_connect_wallet.remember')}
      </Button>
    </>
  )
}

export const AuthDialog: React.FC = () => {
  const isAuthModalOpen = useAtomValue(isAuthModalOpenAtom)
  const onCloseAuthDialog = useCloseAuthModal()
  return (
    <Modal
      size="sm"
      autoFocus={false}
      isOpen={isAuthModalOpen}
      onClose={onCloseAuthDialog}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <CloseButton onClick={onCloseAuthDialog} />
        <ModalBody>
          <AuthContent />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
