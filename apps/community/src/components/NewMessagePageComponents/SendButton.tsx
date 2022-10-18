import { Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHelpers } from '@remirror/react'
import { useTrackClick, TrackEvent, useDialog } from 'hooks'
import { useAPI } from '../../hooks/useAPI'
import { useToast } from '../../hooks/useToast'

export interface SendButtonProps {
  subject: string
  onSend?: () => void
}

export const SendButton: React.FC<SendButtonProps> = ({ subject, onSend }) => {
  const { t } = useTranslation('new_message')
  const api = useAPI()
  const { getHTML } = useHelpers()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const dialog = useDialog()

  const trackClickCommunitySendConfirm = useTrackClick(
    TrackEvent.CommunityClickCommunitySendConfirm
  )

  const onSendMessage = async () => {
    if (isLoading) return
    trackClickCommunitySendConfirm()
    setIsLoading(true)
    try {
      await api.sendMessage(subject, getHTML())
      t('send_succeed')
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

  const isDisabled = !subject

  return (
    <Button
      variant="solid-rounded"
      colorScheme="blackButton"
      w="138px"
      onClick={() => {
        dialog({
          title: t('send_confirm'),
          description: t('send_description'),
          okText: t('confirm'),
          onConfirm: onSendMessage,
          okButtonProps: {
            colorScheme: 'blackButton',
          },
        })
      }}
      isDisabled={isDisabled}
      isLoading={isLoading}
    >
      {t('send')}
    </Button>
  )
}
