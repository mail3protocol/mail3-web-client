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
  Center,
  Button as RowButton,
  Box,
} from '@chakra-ui/react'
import { Button } from 'ui'
import React, { useState } from 'react'
import { TrackEvent, useDialog, useTrackClick } from 'hooks'
import { useTranslation } from 'next-i18next'
import CommunityGuide11 from '../../../assets/commuity-guide/1-1.png'
import CommunityGuide12 from '../../../assets/commuity-guide/1-2.png'
import CommunityGuide13 from '../../../assets/commuity-guide/1-3.png'
import CommunityGuide2 from '../../../assets/commuity-guide/2.png'

const IMAGE_COUNT = 2

export const Page1 = () => (
  <Flex direction={{ base: 'column', md: 'row' }} w="full" flex={0} h="full">
    <Center w={{ base: 'full', md: '47.5%' }} h={{ base: '49%', md: 'full' }}>
      <Image src={CommunityGuide11.src} w="full" h="full" objectFit="contain" />
    </Center>
    <Center w={{ base: 'full', md: '5%' }} h={{ base: '2%', md: 'full' }}>
      <Image
        src={CommunityGuide13.src}
        w="full"
        h="full"
        objectFit="contain"
        transform={{
          base: 'scale(5) rotate(90deg)',
          md: 'scale(2)',
        }}
      />
    </Center>
    <Center w={{ base: 'full', md: '47.5%' }} h={{ base: '49%', md: 'full' }}>
      <Image src={CommunityGuide12.src} w="full" h="full" objectFit="contain" />
    </Center>
  </Flex>
)

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        w={{ base: 'full', md: 'calc(100% - 40px)' }}
        h={{ base: 'full', md: 'calc(100% - 40px)' }}
        maxH={{ base: '100vh', md: '578px' }}
        // maxH="578px"
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
                direction="column"
                style={{
                  opacity: index === 0 ? 1 : 0,
                }}
              >
                <Box
                  flex={1}
                  fontSize="16px"
                  textAlign="center"
                  maxW="400px"
                  mx="auto"
                >
                  {t('community_guide_modal.text.1')}
                </Box>
                <Page1 />
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
                direction="column"
              >
                <Box fontSize="16px" textAlign="center" maxW="400px" mx="auto">
                  {t('community_guide_modal.text.2')}
                </Box>
                <Image
                  src={CommunityGuide2.src}
                  objectFit="contain"
                  w="auto"
                  h="full"
                  flex={0}
                  my="auto"
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
                  onConfirm: () => {
                    trackClickCommunityApply()
                  },
                  onCancel: () => {
                    trackClickCommunityNoThanks()
                  },
                  onClose: () => {
                    trackClickCommunityNoThanks()
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
