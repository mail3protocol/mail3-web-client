import {
  Box,
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
  useDisclosure,
} from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { IpfsModal } from 'ui'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHelpers } from '@remirror/react'
import { useTrackClick, TrackEvent } from 'hooks'
import { useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { copyText } from 'shared'
import { useAPI } from '../../hooks/useAPI'
import { useToast } from '../../hooks/useToast'
import { RoutePath } from '../../route/path'
import { CloseButton } from '../ConfirmDialog'
import { APP_URL } from '../../constants/env/url'

export interface SendButtonProps extends ButtonProps {
  subject: string
  abstract: string
  isDisabled?: boolean
  onSend?: () => void
}

export const SendButton: React.FC<SendButtonProps> = ({
  subject,
  onSend,
  abstract,
  isDisabled: isPropsDisabled,
  ...props
}) => {
  const { t } = useTranslation(['new_message', 'common'])
  const api = useAPI()
  const { getHTML } = useHelpers()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navi = useNavigate()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isSent, setIsSent] = useState(false)
  const [articleId, setArticleId] = useState('')

  const trackClickCommunitySendConfirm = useTrackClick(
    TrackEvent.CommunityClickCommunitySendConfirm
  )

  const articleUrl = useMemo(() => `${APP_URL}/p/${articleId}`, [articleId])

  const onSendMessage = async () => {
    if (isLoading) return
    trackClickCommunitySendConfirm()
    setIsLoading(true)
    try {
      const data = await api.sendMessage(subject, getHTML(), abstract)
      setArticleId(data.data.uuid)
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
        <>
          <Heading as="h3" fontSize="18px" display="flex" alignItems="center">
            <CheckCircleIcon w="16px" h="16px" mr="4px" my="auto" />
            {t('send_succeed')}
          </Heading>
          <Box mt="24px" fontWeight="500" fontSize="16px" lineHeight="22px">
            {t('share_message')}
          </Box>
          <Box
            mt="8px"
            fontWeight="500"
            fontSize="16px"
            lineHeight="20px"
            background="#F2F2F2"
            borderRadius="8px"
            p="6px"
          >
            URL:{' '}
            <Box as="span" color="primary.900">
              {articleUrl}
            </Box>
          </Box>
        </>
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
      <Heading as="h3" fontSize="18px">
        {t('send_description')}
      </Heading>
    )
  }, [isSent, isLoading, t])

  const {
    isOpen: isOpenIpfsModal,
    onOpen: onOpenIpfsModal,
    onClose: onCloseIpfsModal,
  } = useDisclosure()

  const {
    data: isUploadedIpfsKey,
    isLoading: isLoadingIsUploadedIpfsKeyState,
  } = useQuery(['get_message_encryption_key_state'], () =>
    api.getMessageEncryptionKeyState().then((res) => res.data.state === 'set')
  )

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
      {!isLoadingIsUploadedIpfsKeyState ? (
        <IpfsModal
          api={api}
          isOpen={isOpenIpfsModal}
          onClose={onCloseIpfsModal}
          isForceConnectWallet={!isUploadedIpfsKey}
          onAfterSignature={async () => {
            onCloseIpfsModal()
            await onSendMessage()
          }}
        />
      ) : null}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnEsc={!isSent && !isLoading}
        closeOnOverlayClick={!isSent && !isLoading}
      >
        <ModalOverlay />
        <ModalContent borderRadius="20px" w="450px" maxW="450px">
          <CloseButton
            onClick={() => {
              navi(RoutePath.Dashboard)
            }}
          />
          <ModalBody py="24px" px="20px">
            {dialogEl}
          </ModalBody>

          <ModalFooter pb="4px" pt="0">
            <HStack spacing={2} w="full" justify="flex-end">
              <Button
                variant="solid-rounded"
                colorScheme="blackButton"
                mb="16px"
                onClick={async () => {
                  if (isSent) {
                    await copyText(articleUrl)
                    toast(t('copy_successfully', { ns: 'common' }), {
                      status: 'success',
                      alertProps: { colorScheme: 'green' },
                    })
                    return
                  }
                  if (isUploadedIpfsKey) {
                    onSendMessage()
                  } else {
                    onOpenIpfsModal()
                  }
                }}
                fontWeight="500"
                px="32px"
                style={{
                  opacity: isLoading ? 0 : undefined,
                  pointerEvents: isLoading ? 'none' : undefined,
                }}
              >
                {isSent ? t('copy_url') : t('successfully_sent.confirm')}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
