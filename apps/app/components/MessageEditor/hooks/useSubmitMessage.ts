import { useHelpers } from '@remirror/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useToast } from 'hooks'
import { useAPI } from '../../../hooks/useAPI'
import { useSubject } from './useSubject'
import { useAttachment } from './useAttachment'
import { useCardSignature } from './useCardSignature'
import { DRAFT_ID_NAME } from './useSaveMessage'
import { RoutePath } from '../../../route/path'

const CARD_SIGNATURE_FILENAME = 'signature.png'
const CARD_SIGNATURE_CONTENT_ID = 'signature'

export function useSubmitMessage() {
  const { getHTML } = useHelpers()
  const api = useAPI()
  const { subject, toAddresses, fromAddress, ccAddresses, bccAddresses } =
    useSubject()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const isDisabledSendButton = [!fromAddress, toAddresses.length <= 0].some(
    (item) => item
  )
  const toast = useToast()
  const { attachments } = useAttachment()
  const { isEnableCardSignature, cardSignatureBase64 } = useCardSignature()
  const onSubmit = async () => {
    if (!fromAddress) return
    if (isLoading) return
    setIsLoading(true)
    let html = getHTML()
    if (isEnableCardSignature && cardSignatureBase64) {
      attachments.push({
        filename: CARD_SIGNATURE_FILENAME,
        contentType: 'image/png',
        content: cardSignatureBase64,
        contentDisposition: 'inline',
        cid: CARD_SIGNATURE_CONTENT_ID,
      })
      html += `<img src="cid:${CARD_SIGNATURE_CONTENT_ID}" alt="cid:${CARD_SIGNATURE_CONTENT_ID}" width="200">`
    }
    try {
      await api.submitMessage({
        from: {
          address: fromAddress,
        },
        subject,
        to: toAddresses.map((address) => ({ address })),
        cc: ccAddresses.map((address) => ({ address })),
        bcc: bccAddresses.map((address) => ({ address })),
        html,
        attachments,
      })
      // eslint-disable-next-line compat/compat
      const draftId = new URLSearchParams(location.search).get(DRAFT_ID_NAME)
      if (draftId) {
        await api.deleteMessage(draftId, { force: true })
      }
      await router.push(RoutePath.Inbox)
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.message || 'unknown error', {
        textProps: {
          bg: '#fff',
          color: '#000',
          fontSize: '14px',
          shadow:
            '0 0 1px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.08)',
        },
      })
      console.error({ err })
    } finally {
      setIsLoading(false)
    }
  }
  return {
    isDisabledSendButton,
    isLoading,
    onSubmit,
  }
}
