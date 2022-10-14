import {
  Box,
  Button,
  Heading,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { TrackEvent, useTrackClick } from 'hooks'
import { ReactComponent as BitSvg } from '../../assets/settings/bit.svg'
import { ReactComponent as EnsSvg } from '../../assets/settings/ens.svg'
import { RoutePath } from '../../route/path'
import { BIT_DOMAIN, ENS_DOMAIN } from '../../constants'

export interface ExperienceUserGuideDialogProps {
  isOpen: boolean
  onClose: () => void
  pageGuard?: boolean
  onCloseComplete?: () => void
}

export const ExperienceUserGuideContent: React.FC = () => {
  const { t } = useTranslation('experience_user_guide_dialog')
  const trackExuserClickRegisterEns = useTrackClick(
    TrackEvent.ExuserClickRegisterEns
  )
  const trackExuserClickRegisterBit = useTrackClick(
    TrackEvent.ExuserClickRegisterBit
  )
  return (
    <>
      <Heading
        borderBottom="1px solid #F4F4F4"
        lineHeight="120%"
        textAlign="center"
        fontSize="16px"
        py="24px"
        px="47px"
      >
        {t('title')}
      </Heading>
      <VStack
        spacing="16px"
        css={`
          a:hover {
            text-decoration: none;
          }
        `}
        fontSize={{ base: '12px', md: '16px' }}
        bg="#F3F3F3"
        py="24px"
        px="47px"
      >
        <Button
          as={Link}
          variant="outline"
          isFullWidth
          leftIcon={<Icon as={BitSvg} w="24px" h="24px" />}
          justifyContent="flex-start"
          px="8px"
          href={BIT_DOMAIN}
          target="_blank"
          rounded="40px"
          borderColor="#000"
          colorScheme="blackAlpha"
          color="#000"
          bg="#fff"
          maxW="246px"
          onClick={() => trackExuserClickRegisterBit()}
        >
          <Box w="full" textAlign="center">
            {t('button.bit')}
          </Box>
        </Button>
        <Button
          as={Link}
          variant="outline"
          isFullWidth
          leftIcon={<Icon as={EnsSvg} w="24px" h="24px" />}
          justifyContent="flex-start"
          px="8px"
          href={ENS_DOMAIN}
          target="_blank"
          rounded="40px"
          borderColor="#000"
          colorScheme="blackAlpha"
          color="#000"
          bg="#fff"
          maxW="246px"
          onClick={() => trackExuserClickRegisterEns()}
        >
          <Box w="full" textAlign="center">
            {t('button.ens')}
          </Box>
        </Button>
      </VStack>
    </>
  )
}

export const ExperienceUserGuideFooter: React.FC<
  Partial<Pick<ExperienceUserGuideDialogProps, 'onClose'>>
> = ({ onClose }) => {
  const { t } = useTranslation('experience_user_guide_dialog')
  const trackExuserClickGotOne = useTrackClick(TrackEvent.ExuserClickGotOne)
  return (
    <Link
      as={RouterLink}
      w="246px"
      onClick={() => {
        onClose?.()
        trackExuserClickGotOne()
      }}
      color="#4E52F5"
      fontSize="12px"
      py="24px"
      to={RoutePath.Settings}
      textAlign="center"
    >
      {t('refresh')}
    </Link>
  )
}

export const ExperienceUserGuideDialog: React.FC<
  ExperienceUserGuideDialogProps
> = ({ isOpen, pageGuard, onCloseComplete, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    isCentered
    closeOnEsc={!pageGuard}
    onCloseComplete={onCloseComplete}
  >
    <ModalOverlay />
    <ModalContent maxW="340px" rounded="24px" pb="8px" w="calc(100% - 40px)">
      <ModalCloseButton top="20px" right="20px" />
      <ModalBody p="0">
        <ExperienceUserGuideContent />
      </ModalBody>
      <ModalFooter display="flex" justifyContent="center" p="0">
        <ExperienceUserGuideFooter onClose={onClose} />
      </ModalFooter>
    </ModalContent>
  </Modal>
)
