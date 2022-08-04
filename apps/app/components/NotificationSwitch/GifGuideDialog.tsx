import {
  AspectRatio,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import NotificationGuideGif from '../../assets/notification_guide.gif'

export const GifGuideDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common')
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW="680px"
        w="calc(100% - 40px)"
        rounded={{ base: '24px', sm: '48px' }}
        pt={{ base: '20px', sm: '40px' }}
        pb={{ base: '20px', sm: '50px' }}
      >
        <ModalHeader
          p="0"
          whiteSpace="pre-line"
          textAlign="center"
          fontSize={{ base: '18px', sm: '24px' }}
          lineHeight={{ base: '24px', sm: '32px' }}
          fontWeight="700"
        >
          {t('bell.gif_guide_title')}
        </ModalHeader>
        <ModalCloseButton
          top={{ base: '15px', sm: '36px' }}
          right={{ base: '15px', sm: '36px' }}
        />
        <ModalBody>
          <AspectRatio ratio={437 / 251}>
            <Image src={NotificationGuideGif} alt="guide" rounded="24px" />
          </AspectRatio>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
