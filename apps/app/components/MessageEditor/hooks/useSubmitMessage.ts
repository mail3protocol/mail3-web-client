import { useHelpers } from '@remirror/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrackEvent, useToast, useTrackClick } from 'hooks'
import { defer, lastValueFrom, retry } from 'rxjs'
import { useTranslation } from 'react-i18next'
import { SubmitMessage } from 'models/src/submitMessage'
import { useAtomValue } from 'jotai'
import { isEthAddress, isPrimitiveEthAddress, truncateMiddle } from 'shared'
import { useAPI } from '../../../hooks/useAPI'
import { useSubject } from './useSubject'
import { useAttachment } from './useAttachment'
import { useCardSignature } from './useCardSignature'
import { RoutePath } from '../../../route/path'
import { API } from '../../../api'
import {
  onRenderElementToImage,
  outputHtmlWithAttachmentImages,
  removeDuplicationAttachments,
} from '../../../utils/editor'
import { CARD_SIGNATURE_ID } from '../components/selectCardSignature'
import {
  DRIFT_BOTTLE_ADDRESS,
  PRODUCT_RECOMMENDATIONS_ADDRESS,
} from '../../../constants'
import { useSending } from '../../../hooks/useSending'
import { AddressNonceErrorReason } from '../../../api/ErrorCode'
import { userPropertiesAtom } from '../../../hooks/useLogin'

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

interface SendEmailTrack {
  match: (body: SubmitMessage.RequestBody) => boolean
  track: () => void
}

export function useSubmitMessage() {
  const { t } = useTranslation('edit-message')
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
  const navi = useNavigate()
  const isDisabledSendButton = [
    !fromAddress,
    toAddresses.length <= 0,
    !subject,
  ].some((item) => item)
  const userProps = useAtomValue(userPropertiesAtom)
  const toast = useToast()
  const { attachments } = useAttachment()
  const { isEnableCardSignature } = useCardSignature()
  const trackReplyDriftbottleMail = useTrackClick(TrackEvent.ReplyDriftbottle)
  const trackSendDriftbottleMail = useTrackClick(TrackEvent.SendDriftbottleMail)
  const trackSentProductSuggestion = useTrackClick(
    TrackEvent.SentProductSuggestion
  )
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { addSendingMessage } = useSending()
  const sendEmailTracks: SendEmailTrack[] = [
    {
      match: ({ subject: s, to }) =>
        s.includes('Product suggestion') &&
        !!to?.some((item) => item.address === PRODUCT_RECOMMENDATIONS_ADDRESS),
      track: () => trackSentProductSuggestion(),
    },
    {
      match: ({ subject: s }) => s.startsWith('Re: [🌊drift bottle]'),
      track: () => trackReplyDriftbottleMail(),
    },
    {
      match: ({ to }) =>
        !!to?.some((address) => address === DRIFT_BOTTLE_ADDRESS),
      track: () => trackSendDriftbottleMail(),
    },
  ]

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
      } = await outputHtmlWithAttachmentImages(html)
      html = replacedAttachmentImageHtml
      const body: SubmitMessage.RequestBody = {
        from: {
          address: fromAddress,
        },
        subject,
        to: toAddresses.map((address) => ({ address })),
        cc: ccAddresses.map((address) => ({ address })),
        bcc: bccAddresses.map((address) => ({ address })),
        html,
        attachments: removeDuplicationAttachments(
          attachments
            .filter((a) => a.contentDisposition !== 'inline')
            .concat(imageAttachments)
        ),
      }

      if (userProps?.nickname) {
        body.from = {
          address: fromAddress,
          name: userProps.nickname,
        }
      } else if (userProps?.defaultAddress) {
        const address = userProps.defaultAddress.split('@')[0]
        let defaultNickname = ''
        if (isPrimitiveEthAddress(address)) {
          defaultNickname = truncateMiddle(address, 6, 4, '_')
        } else if (isEthAddress(address)) {
          defaultNickname = address.includes('.')
            ? address.split('.')[0]
            : address
        }
        body.from = {
          address: fromAddress,
          name: defaultNickname,
        }
      }

      const submitMessageResult = await api.submitMessage(body)
      addSendingMessage({ messageId: submitMessageResult.data.messageId })
      setIsSubmitted(true)
      sendEmailTracks.forEach((item) => {
        if (item.match(body)) item.track()
      })
      await removeDraft(api)
      onReset()
      navi(RoutePath.Inbox)
    } catch (err: any) {
      if (
        err.response.data.reason ===
        AddressNonceErrorReason.INVALID_ATTACHMENT_FILE_NAME
      ) {
        toast(t('invalid_file_name'))
      } else {
        toast(err?.response?.data?.message || err?.message || 'unknown error')
      }
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
