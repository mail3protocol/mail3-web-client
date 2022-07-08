import {
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Image,
  Flex,
  Button as RowButton,
  Box,
} from '@chakra-ui/react'
import { Button } from 'ui'
import React, { useState } from 'react'
import { TrackEvent, useDialog, useToast, useTrackClick } from 'hooks'
import { useTranslation } from 'react-i18next'
import DesktopImage1 from '../../../assets/commuity-guide/desktop1.png'
import DesktopImage2 from '../../../assets/commuity-guide/desktop2.png'
import MobileImage1 from '../../../assets/commuity-guide/mobile1.png'
import MobileImage2 from '../../../assets/commuity-guide/mobile2.png'
import { useAPI } from '../../../hooks/useAPI'

const IMAGE_COUNT = 2

export const CommunityGuideModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('edit-message')
  const trackClickCommunityApply = useTrackClick(
    TrackEvent.AppEditMessageClickCommunityApply
  )
  const trackClickCommunityNoThanks = useTrackClick(
    TrackEvent.AppEditMessageClickCommunityNoThanks
  )
  const dialog = useDialog()
  const [index, setIndex] = useState(0)
  const api = useAPI()
  const toast = useToast()
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        w={{ base: 'full', md: 'calc(100% - 40px)' }}
        h={{ base: 'full', md: 'calc(100% - 40px)' }}
        maxH={{ base: '100vh', md: '578px' }}
        maxW="855px"
        rounded={{ base: '0', md: '48px' }}
        py="32px"
        m="0"
      >
        <ModalBody px="20px">
          <Flex direction="column" w="full" h="full">
            <Heading
              fontSize="24px"
              textAlign="center"
              lineHeight="36px"
              whiteSpace="pre-line"
            >
              {t('community_guide_modal.title')}
            </Heading>
            <Flex
              w="full"
              h="full"
              position="relative"
              flex={1}
              pointerEvents="none"
            >
              <Flex
                w="full"
                h="full"
                position="absolute"
                top="0"
                left="0"
                transition="200ms"
                direction={{ base: 'column', md: 'column-reverse' }}
                style={{
                  opacity: index === 0 ? 1 : 0,
                }}
              >
                <Box
                  flex={0}
                  fontSize="16px"
                  textAlign="center"
                  maxW="400px"
                  mx="auto"
                >
                  {t('community_guide_modal.text.1')}
                </Box>
                <Image
                  src={DesktopImage1.src}
                  w="full"
                  display={{ base: 'none', md: 'block' }}
                />
                <Image
                  src={MobileImage1.src}
                  h="full"
                  w="full"
                  objectFit="contain"
                  display={{ base: 'block', md: 'none' }}
                />
              </Flex>
              <Flex
                w="full"
                h="full"
                position="absolute"
                top="0"
                left="0"
                transition="200ms"
                style={{
                  opacity: index === 1 ? 1 : 0,
                }}
                overflowX="auto"
                overflowY="hidden"
                direction={{ base: 'column', md: 'column-reverse' }}
              >
                <Box
                  fontSize="16px"
                  textAlign="center"
                  maxW="400px"
                  mx="auto"
                  flex={0}
                >
                  {t('community_guide_modal.text.2')}
                </Box>
                <Image
                  src={DesktopImage2.src}
                  h="full"
                  w="full"
                  objectFit="contain"
                  display={{ base: 'none', md: 'block' }}
                />
                <Image
                  src={MobileImage2.src}
                  h="full"
                  w="full"
                  objectFit="contain"
                  display={{ base: 'block', md: 'none' }}
                />
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <Stack
            direction="row"
            spacing="12px"
            justify="center"
            mt="auto"
            pb="25px"
          >
            {new Array(IMAGE_COUNT)
              .fill(0)
              .map((_, i) => i)
              .map((i) => (
                <RowButton
                  variant="unstyled"
                  minW="unset"
                  key={i}
                  bg={i === index ? '#000' : '#C4C4C4'}
                  w="10px"
                  h="10px"
                  rounded="100px"
                  onClick={() => setIndex(i)}
                />
              ))}
          </Stack>
          <Button
            w="218px"
            onClick={() => {
              if (index === 0) {
                setIndex(1)
              }
              if (index === 1) {
                dialog({
                  type: 'text',
                  title: t('Apply to become a beta user'),
                  description: t(
                    'You will have the possibility to experience this cool feature for the first time.'
                  ),
                  showCloseButton: true,
                  onConfirm: async () => {
                    trackClickCommunityApply()
                    await api.applyToExperienceNewFeature('community-mail')
                    toast(t('succeeded'))
                    onClose()
                  },
                  onCancel: () => {
                    trackClickCommunityNoThanks()
                    onClose()
                  },
                  onClose: () => {
                    trackClickCommunityNoThanks()
                    onClose()
                  },
                  okText: t('apply'),
                  cancelText: t('no_thanks'),
                })
              }
            }}
          >
            {t('community_guide_modal.next')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
