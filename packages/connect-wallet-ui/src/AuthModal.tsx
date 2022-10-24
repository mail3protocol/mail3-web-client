import {
  Box,
  Flex,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Button } from 'ui'
import { truncateMiddle } from 'shared'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as WalletSvg } from 'assets/svg/wallet.svg'
import { ReactComponent as LeftArrowSvg } from 'assets/svg/left-arrow.svg'

export const AuthModal: React.FC<{
  account?: string
  isOpen: boolean
  onClose: () => void
  isLoading: boolean
  onRemember: () => Promise<void> | void
  onBack: () => void
}> = ({ account, isOpen, onClose, isLoading, onRemember, onBack }) => {
  const [t] = useTranslation('common')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
                <Icon as={WalletSvg} color="#292D32" />
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
