import { useHelpers } from '@remirror/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { TrackEvent, useToast, useTrackClick } from 'hooks'
import { defer, lastValueFrom, retry } from 'rxjs'
import { useAPI } from '../../../hooks/useAPI'
import { useSubject } from './useSubject'
import { useAttachment } from './useAttachment'
import { useCardSignature } from './useCardSignature'
import { RoutePath } from '../../../route/path'
import { API } from '../../../api'
import {
  onRenderElementToImage,
  outputHtmlWithAttachmentImages,
} from '../../../utils/editor'
import { CARD_SIGNATURE_ID } from '../components/selectCardSignature'
import { DRIFT_BOTTLE_ADDRESS } from '../../../constants'
import { useSending } from '../../../hooks/useSending'

export const ID_NAME = 'id'
export const ACTION_NAME = 'action'

export async function removeDraft(api: API) {
  // eslint-disable-next-line compat/compat
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get(ID_NAME)
  const action = searchParams.get(ACTION_NAME)
  if (id && action === null) {
    await lastValueFrom(
      defer(() => api.deleteMessage(id, { force: true })).pipe(retry(3))
    ).catch(() => null)
  }
}

export function useSubmitMessage() {
  const { getHTML } = useHelpers()
  const api = useAPI()
  const {
    subject,
    toAddresses,
    fromAddress,
    ccAddresses,
    bccAddresses,
    onReset,
  } = useSubject()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const isDisabledSendButton = [
    !fromAddress,
    toAddresses.length <= 0,
    !subject,
  ].some((item) => item)
  const toast = useToast()
  const { attachments } = useAttachment()
  const { isEnableCardSignature } = useCardSignature()
  const trackReplyDriftbottleMail = useTrackClick(TrackEvent.ReplyDriftbottle)
  const trackSendDriftbottleMail = useTrackClick(TrackEvent.SendDriftbottleMail)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { addSendingMessage } = useSending()
  const onSubmit = async () => {
    if (!fromAddress) return
    if (isLoading) return
    try {
      window.scroll(0, 0)
      setIsLoading(true)
      let html = getHTML()
      if (isEnableCardSignature) {
        const cardSignatureContent = await onRenderElementToImage(
          document.getElementById(CARD_SIGNATURE_ID) as HTMLDivElement
        )
        html += `<p style="text-align: center"><img src="${cardSignatureContent}" alt="card-signature" style="width: 200px; height: auto"></p>`
      }
      const {
        html: replacedAttachmentImageHtml,
        attachments: imageAttachments,
      } = outputHtmlWithAttachmentImages(html)
      html = replacedAttachmentImageHtml
      const isSendToDriftBottle = toAddresses.some(
        (address) => address === DRIFT_BOTTLE_ADDRESS
      )
      const isReplyDriftbottleMail = subject.startsWith('Re: [🌊drift bottle]')
      const submitMessageResult = await api.submitMessage({
        from: {
          address: fromAddress,
        },
        subject,
        to: toAddresses.map((address) => ({ address })),
        cc: ccAddresses.map((address) => ({ address })),
        bcc: bccAddresses.map((address) => ({ address })),
        html,
        attachments: attachments
          .filter((a) => a.contentDisposition !== 'inline')
          .concat(imageAttachments),
      })
      addSendingMessage({ messageId: submitMessageResult.data.messageId })
      setIsSubmitted(true)
      if (isSendToDriftBottle) {
        trackSendDriftbottleMail()
      }
      if (isReplyDriftbottleMail) {
        trackReplyDriftbottleMail()
      }
      await removeDraft(api)
      onReset()
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
    isSubmitted,
    onSubmit,
  }
}
