import {
  Button,
  ButtonProps,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHelpers } from '@remirror/react'
import { useTrackClick, TrackEvent } from 'hooks'
import { useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { useAPI } from '../../hooks/useAPI'
import { useToast } from '../../hooks/useToast'
import { RoutePath } from '../../route/path'
import { CloseButton } from '../ConfirmDialog'

export interface SendButtonProps extends ButtonProps {
  subject: string
  isDisabled?: boolean
  onSend?: () => void
}

export const SendButton: React.FC<SendButtonProps> = ({
  subject,
  onSend,
  isDisabled: isPropsDisabled,
  ...props
}) => {
  const { t } = useTranslation('new_message')
  const api = useAPI()
  const { getHTML } = useHelpers()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navi = useNavigate()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isSent, setIsSent] = useState(false)

  const trackClickCommunitySendConfirm = useTrackClick(
    TrackEvent.CommunityClickCommunitySendConfirm
  )

  const onSendMessage = async () => {
    if (isLoading) return
    trackClickCommunitySendConfirm()
    setIsLoading(true)
    try {
      await api.sendMessage(subject, getHTML())
      setIsSent(true)
      onSend?.()
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        t('unknown_error', { ns: 'common' })
      toast(
        t('send_failed', {
          message: errorMessage,
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = !subject || isPropsDisabled

  const dialogEl = useMemo(() => {
    if (isSent) {
      return (
        <Heading as="h3" fontSize="18px" display="flex" alignItems="center">
          <CheckCircleIcon w="16px" h="16px" mr="4px" my="auto" />
          {t('send_succeed')}
        </Heading>
      )
    }
    if (isLoading) {
      return (
        <Heading as="h3" fontSize="18px" display="flex" alignItems="center">
          <Spinner w="16px" h="16px" mr="4px" my="auto" />
          {t('sending')}
        </Heading>
      )
    }
    return (
      <>
        <Heading as="h3" fontSize="18px" mb="24px">
          {t('send_confirm')}
        </Heading>
        <Text fontSize="16px" fontWeight="500">
          {t('send_description')}
        </Text>
      </>
    )
  }, [isSent, isLoading, t])

  return (
    <>
      <Button
        variant="solid-rounded"
        colorScheme="blackButton"
        w="138px"
        onClick={onOpen}
        isDisabled={isDisabled}
        isLoading={isLoading}
        {...props}
      >
        {t('send')}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnEsc={!isSent && !isLoading}
        closeOnOverlayClick={!isSent && !isLoading}
      >
        <ModalOverlay />
        <ModalContent borderRadius="20px" w="450px" maxW="450px">
          {!isSent && !isLoading ? <CloseButton onClick={onClose} /> : null}
          <ModalBody py="24px" px="20px">
            {dialogEl}
          </ModalBody>

          <ModalFooter pb="4px" pt="0">
            <HStack spacing={2} w="full" justify="flex-end">
              <Button
                variant="solid-rounded"
                colorScheme="blackButton"
                mb="16px"
                onClick={() => {
                  if (isSent) {
                    navi(RoutePath.Dashboard)
                    return
                  }
                  onSendMessage()
                }}
                fontWeight="500"
                px="32px"
                style={{
                  opacity: isLoading ? 0 : undefined,
                  pointerEvents: isLoading ? 'none' : undefined,
                }}
              >
                {isSent ? t('ok') : t('successfully_sent.confirm')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
