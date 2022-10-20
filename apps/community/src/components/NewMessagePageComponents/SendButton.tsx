import { Button, ButtonProps } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHelpers } from '@remirror/react'
import { useTrackClick, TrackEvent, useDialog } from 'hooks'
import { useNavigate } from 'react-router-dom'
import { useAPI } from '../../hooks/useAPI'
import { useToast } from '../../hooks/useToast'
import { RoutePath } from '../../route/path'

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
  const dialog = useDialog()
  const navi = useNavigate()

  const trackClickCommunitySendConfirm = useTrackClick(
    TrackEvent.CommunityClickCommunitySendConfirm
  )

  const onSendMessage = async () => {
    if (isLoading) return
    trackClickCommunitySendConfirm()
    setIsLoading(true)
    try {
      await api.sendMessage(subject, getHTML())
      dialog({
        title: t('successfully_sent.title'),
        description: t('successfully_sent.description'),
        okText: t('successfully_sent.confirm'),
        onConfirm() {
          navi(RoutePath.Dashboard)
        },
        showCloseButton: false,
      })
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
      {...props}
    >
      {t('send')}
    </Button>
  )
}
