import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  Heading,
  Flex,
  VStack,
  Text,
  Box,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { useAccount } from 'hooks'
import { Button } from 'ui'
import { truncateMiddle } from 'shared'
import { ReactComponent as WalletSvg } from '../../assets/wallet.svg'
import { ReactComponent as LeftArrowSvg } from '../../assets/left-arrow.svg'
import {
  useAuth,
  useAuthModalOnBack,
  useCloseAuthModal,
  useIsAuthModalOpen,
} from '../../hooks/useLogin'
import { useRemember } from '../../hooks/useRemember'

export const AuthModal: React.FC = () => {
  const [t] = useTranslation('common')
  const account = useAccount()
  const closeAuthModal = useCloseAuthModal()
  const isAuthModalOpen = useIsAuthModalOpen()
  const onBack = useAuthModalOnBack()
  const { onRemember, isLoading } = useRemember()

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent maxWidth="340px">
        <ModalHeader
          display="flex"
          fontSize="16px"
          position="relative"
          alignItems="center"
          justifyContent="center"
          borderBottom="1px solid #F4F4F4"
        >
          <Box
            cursor="pointer"
            position="absolute"
            left="24px"
            onClick={onBack}
          >
            <LeftArrowSvg />
          </Box>
          <Heading fontSize="16px">{t('connect.connect-wallet')}</Heading>
        </ModalHeader>
        <ModalBody padding="24px 30px 32px 30px">
          <VStack spacing="20px">
            <Text>{t('auth.desc')}</Text>
            <Button
              isFullWidth
              colorScheme="gray"
              color="black"
              cursor="text"
              bg="#f7f7f7"
              as="div"
              _hover={{
                bg: '#f7f7f7',
              }}
            >
              <Flex w="100%" alignItems="center" justifyContent="space-between">
                <Text fontWeight={600} fontSize="16px">
                  {truncateMiddle(account, 6, 4)}
                </Text>
                <WalletSvg />
              </Flex>
            </Button>
            <Button
              isLoading={isLoading}
              loadingText={t('auth.check-wallet')}
              onClick={onRemember}
              isFullWidth
            >
              {t('auth.remember')}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export const Auth: React.FC = () => {
  useAuth()
  return null
}
