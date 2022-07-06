import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
  Center,
} from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { Button } from 'ui'
import { NotConnectWallet, useConnectWalletDialog, useSignMessage } from 'hooks'
import { useTranslation } from 'next-i18next'
import DesktopIpfsGuidePng from '../../assets/ipfs-guide/desktop.png'
import MobileIpfsGuidePng from '../../assets/ipfs-guide/mobile.png'
import { useAPI } from '../../hooks/useAPI'
import { digestMessage } from '../../utils'

const stringToBeSigned = `Generate MESSAGE ENCRYPTION key for me and I authorize current dApp to access my MESSAGE ENCRYPTION key. (This operation won’t affect your digital assets.)

nonce=1`

export const IpfsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onAfterSignature?: (signatureStr: string) => void
}> = ({ isOpen, onClose, onAfterSignature }) => {
  const api = useAPI()
  const { t } = useTranslation('edit-message')
  const signMessage = useSignMessage()
  const { onOpen: onOpenWalletDialog } = useConnectWalletDialog()
  const onGenerateKey = useCallback(async () => {
    try {
      const signedString = await signMessage(stringToBeSigned)
      const signedStringWithSha256 = `0x${await digestMessage(signedString, {
        algorithm: 'SHA-256',
      })}`
      await api.updateMessageEncryptionKey(signedStringWithSha256)
      onAfterSignature?.(signedString)
    } catch (e) {
      if (e instanceof NotConnectWallet) {
        onOpenWalletDialog()
      }
    }
  }, [onAfterSignature, signMessage])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      returnFocusOnClose={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        maxW="641px"
        rounded={{ base: '24px', md: '48px' }}
        pb="32px"
        w="calc(100% - 40px)"
      >
        <ModalHeader
          borderBottom="1px solid #F4F4F4"
          lineHeight="95px"
          textAlign="center"
          fontSize="24px"
          p="0"
        >
          {t('ipfs_modal.title')}
        </ModalHeader>
        <ModalBody>
          <Text maxW="495px" mx="auto" whiteSpace="pre-line" textAlign="center">
            {t('ipfs_modal.content')}
          </Text>
          <Center
            bg="rgba(244, 251, 241, 0.5)"
            rounded="24px"
            px="24px"
            pt="10px"
            minH="216px"
            mt="16px"
          >
            <Image
              src={DesktopIpfsGuidePng.src}
              display={{ base: 'none', md: 'block' }}
            />
            <Image
              src={MobileIpfsGuidePng.src}
              display={{ base: 'block', md: 'none' }}
            />
          </Center>
        </ModalBody>

        <ModalFooter display="flex" justifyContent="center" p="0" mt="24px">
          <Button w="246px" lineHeight="46px" h="46px" onClick={onGenerateKey}>
            {t('ipfs_modal.generate_key')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
