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
import { TrackEvent, useTrackClick } from 'hooks'
import { useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { copyText } from 'shared'
import { useAPI } from '../../hooks/useAPI'
import { useToast } from '../../hooks/useToast'
import { RoutePath } from '../../route/path'
import { CloseButton } from '../ConfirmDialog'
import { APP_URL } from '../../constants/env/url'
import { MessageType } from '../../api/modals/MessageListResponse'
import { QueryKey } from '../../api/QueryKey'

export interface SendButtonProps extends ButtonProps {
  subject: string
  abstract: string
  isDisabled?: boolean
  onSend?: () => void
  messageType: MessageType
}

const ABSTRACT_LENGTH = 153
function getAbstract({ abstract, html }: { abstract?: string; html?: string }) {
  if (abstract) return abstract
  if (!html) return ''
  const parser = new DOMParser()
  const dom = parser.parseFromString(html, 'text/html')
  const text = dom.body.innerText || ''
  return `${text.slice(0, ABSTRACT_LENGTH)}${
    text.length > ABSTRACT_LENGTH ? '...' : ''
  }`
}

export const SendButton: React.FC<SendButtonProps> = ({
  subject,
  onSend,
  abstract,
  isDisabled: isPropsDisabled,
  messageType,
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
      const html = getHTML()
      const data = await api.sendMessage(
        subject,
        html,
        getAbstract({ html, abstract }),
        {
          messageType,
        }
      )
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
            bg="inputBackground"
            rounded="8px"
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
    if (messageType === MessageType.Premium) {
      return (
        <>
          <Heading as="h3" fontSize="18px">
            {t('send_premium_message_confirm_title')}
          </Heading>
          <Box mt="24px" fontWeight="500" fontSize="16px" lineHeight="22px">
            {t('send_premium_message_confirm_text')}
          </Box>
        </>
      )
    }
    return (
      <Heading as="h3" fontSize="18px">
        {t('send_description')}
      </Heading>
    )
  }, [isSent, isLoading, t, messageType])

  const {
    isOpen: isOpenIpfsModal,
    onOpen: onOpenIpfsModal,
    onClose: onCloseIpfsModal,
  } = useDisclosure()

  const {
    data: isUploadedIpfsKey,
    isLoading: isLoadingIsUploadedIpfsKeyState,
  } = useQuery([QueryKey.GetMessageEncryptionKeyState], () =>
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
          isContent
          isOpen={isOpenIpfsModal}
          onClose={onCloseIpfsModal}
          isForceConnectWallet={!isUploadedIpfsKey}
          onAfterSignature={async (_, key) => {
            await api.updateMessageEncryptionKey(key)
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
        onCloseComplete={() => {
          if (isSent) {
            navi(RoutePath.Dashboard)
          }
        }}
      >
        <ModalOverlay />
        <ModalContent borderRadius="20px" w="450px" maxW="450px">
          <CloseButton onClick={onClose} />
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
