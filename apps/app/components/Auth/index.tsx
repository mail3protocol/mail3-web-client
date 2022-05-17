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
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import {
  SignupResponseCode,
  useAccount,
  useProvider,
  useSignup,
  buildSignMessaege,
  useToast,
} from 'hooks'
import { Button } from 'ui'
import { useRouter } from 'next/router'
import { truncateMiddle } from '../../utils'
import WalletSvg from '../../assets/wallet.svg'
import LeftArrowSvg from '../../assets/left-arrow.svg'
import {
  useAuth,
  useAuthModalOnBack,
  useCloseAuthModal,
  useIsAuthModalOpen,
  useLogin,
} from '../../hooks/useLogin'
import { RoutePath } from '../../route/path'

export const AuthModal: React.FC = () => {
  const [t] = useTranslation('common')
  const account = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const signatureDesc = t('auth.sign')
  const signup = useSignup(signatureDesc)
  const provider = useProvider()
  const _toast = useToast()
  const toast = (s: string) => _toast(s, { position: 'top', duration: 2000 })
  const login = useLogin()
  const closeAuthModal = useCloseAuthModal()
  const isAuthModalOpen = useIsAuthModalOpen()
  const router = useRouter()
  const onBack = useAuthModalOnBack()
  const onSign = async (nonce: number) => {
    if (provider == null) {
      toast(t('auth.errors.wallet-not-connected'))
      return null
    }
    const message = buildSignMessaege(nonce, signatureDesc)
    const signature = await provider.getSigner().signMessage(message)

    return {
      message,
      signature,
    }
  }

  const onRemember = async () => {
    setIsLoading(true)
    try {
      const { nonce, error, code, signature, message } = await signup()
      switch (code) {
        case SignupResponseCode.Registered: {
          const signedData = await onSign(nonce!)
          if (signedData != null) {
            await login(signedData.message, signedData.signature)
            closeAuthModal()
          }
          break
        }
        case SignupResponseCode.Success: {
          await login(message!, signature!)
          closeAuthModal()
          router.push(RoutePath.Setup)
          break
        }
        case SignupResponseCode.ConditionNotMeet:
          toast(t('auth.errors.condition-not-meet'))
          break
        default:
          toast(
            error instanceof Error ? error?.message : t('auth.errors.unknown')
          )
          break
      }
    } catch (error: any) {
      if (error?.code !== 4001) {
        toast(error?.message ?? t('auth.errors.unknown'))
      }
    } finally {
      setIsLoading(false)
    }
  }

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
                  {truncateMiddle(account, 6, 6)}
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
