import {
  AspectRatio,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Center,
  Text,
  Icon,
} from '@chakra-ui/react'
import React, { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import NotificationMacEdgeGuideGif from '../../assets/notification/gif_guides/mac_edge.gif'
import NotificationMacChromeGuideGif from '../../assets/notification/gif_guides/mac_chrome.gif'
import { ReactComponent as NotFoundSvg } from '../../assets/not_found_message.svg'
import LoadingPng from '../../assets/mailbox/loading.gif'
import { isChrome, isEdge, isWindows } from '../../utils/env'

export const GifGuideDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common')
  const gifImage: string = useMemo(() => {
    if (isEdge() && !isWindows()) return NotificationMacEdgeGuideGif
    if (isChrome() && !isWindows()) return NotificationMacChromeGuideGif
    if (isEdge() && isWindows()) return NotificationMacEdgeGuideGif
    return NotificationMacChromeGuideGif
  }, [])
  const [isLoadImageIsFailed, setIsLoadImageIsFailed] = useState(false)
  useEffect(() => {
    setIsLoadImageIsFailed(false)
  }, [gifImage])

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
            <Image
              src={gifImage}
              alt="guide"
              rounded="24px"
              onError={() => setIsLoadImageIsFailed(true)}
              fallback={
                <Center
                  w="full"
                  h="full"
                  flexDirection="column"
                  pointerEvents="none"
                  userSelect="none"
                >
                  {isLoadImageIsFailed ? (
                    <>
                      <Icon as={NotFoundSvg} h="90px" w="auto" />
                      <Text mt="10px" fontSize="16px" fontWeight="bold">
                        {t('image_not_found')}
                      </Text>
                    </>
                  ) : (
                    <Image src={LoadingPng} alt="loading" w="290px" h="auto" />
                  )}
                </Center>
              }
            />
          </AspectRatio>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
