import { Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHelpers } from '@remirror/react'
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

  const onSendMessage = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      await api.sendMessage(subject, getHTML())
      onSend?.()
      t('send_succeed')
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
      onClick={onSendMessage}
      isDisabled={isDisabled}
    >
      {t('send')}
    </Button>
  )
}
