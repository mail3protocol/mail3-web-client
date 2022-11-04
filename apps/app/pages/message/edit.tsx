import React, { useEffect, useMemo, useState } from 'react'
import { CONTAINER_MAX_WIDTH } from 'ui'
import { Box } from '@chakra-ui/react'
import { SubmitMessage } from 'models/src/submitMessage'
import { useAtomValue } from 'jotai'
import { SignatureStatus, useDidMount } from 'hooks'
import { useQuery } from 'react-query'
import { GetMessage } from 'models/src/getMessage'
import { useLocation, useSearchParams } from 'react-router-dom'
import { GetMessageContent } from 'models/src/getMessageContent'
import { MessageEditor } from '../../components/MessageEditor'
import { useSubject } from '../../components/MessageEditor/hooks/useSubject'
import { userPropertiesAtom } from '../../hooks/useLogin'
import { useAttachment } from '../../components/MessageEditor/hooks/useAttachment'
import { useAPI } from '../../hooks/useAPI'
import { useSaveMessage } from '../../components/MessageEditor/hooks/useSaveMessage'
import { replaceHtmlAttachImageSrc } from '../../utils/editor'
import { filterEmails, isHttpUriNoBlankSpaceReg } from '../../utils'
import { Query } from '../../api/query'
import { catchApiResponse } from '../../utils/api'
import { GotoInbox } from '../../components/GotoInbox'
import { useRedirectHome } from '../../hooks/useRedirectHome'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

function getDefaultTemplate(content: string) {
  return `<p>
<br/>
<br/>
<br/>
${content}
</p>`
}

function getReplyTemplate(content: string, signContent: string) {
  return getDefaultTemplate(`<blockquote style="border-left: 2px solid #6f6f6f; background-color: #f7f7f7; padding: 6px; overflow: auto; margin: 0 0 0 8px; color: #6F6F6F; word-break: break-word;">
${content}
</blockquote>
<br/>
<br/>
${signContent}`)
}

function getForwardTemplate(content: string, signContent: string) {
  return getDefaultTemplate(`<blockquote style="background-color: #f7f7f7; padding: 8px; border-radius: 8px; margin: 0; color: #6F6F6F; word-break: break-word;">
<p>---------- Forwarded message ---------</p>
${content}
</blockquote>
<br/>
<br/>
${signContent}
`)
}

function replaceSignContentUrlToATag(signContent: string) {
  return signContent.replace(
    isHttpUriNoBlankSpaceReg,
    (url) => `<a href="${url}">${url}</a>`
  )
}

export type Action = SubmitMessage.ReferenceAction

export interface MessageData {
  messageInfo: GetMessage.Response
  messageContent: GetMessageContent.Response
}

export const NewMessagePage = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const locationState = location.state as MessageData | undefined
  const { cc, bcc, to, forceTo, id, action, subject } = useMemo(() => {
    const handleAddresses = (str?: string | null) =>
      str ? filterEmails(str.split(',')) : null
    return {
      cc: handleAddresses(searchParams.get('cc')),
      bcc: handleAddresses(searchParams.get('bcc')),
      to: handleAddresses(searchParams.get('to')),
      forceTo: handleAddresses(searchParams.get('forceTo')),
      action: searchParams.get('action') as Action,
      id: searchParams.get('id'),
      subject: searchParams.get('subject'),
    }
  }, [searchParams])
  const { isAuth, redirectHome } = useRedirectHome()
  const api = useAPI()
  const userProperties = useAtomValue(userPropertiesAtom)
  const signatureStatus = userProperties?.signature_status as SignatureStatus
  const isEnableSignatureText =
    signatureStatus === SignatureStatus.OnlyText ||
    signatureStatus === SignatureStatus.BothEnabled
  const {
    setSubject,
    setToAddresses,
    setCcAddresses,
    setBccAddresses,
    setFromAddress,
    onReset,
  } = useSubject()
  const {
    onResetAttachments,
    attachments,
    isLoadingAttachments,
    loadAttachments,
  } = useAttachment()
  const { onResetSavingAtom } = useSaveMessage()

  useDidMount(() => {
    onReset()
    onResetAttachments()
    onResetSavingAtom()
    if (to) setToAddresses(to)
    if (forceTo) setToAddresses(forceTo)
    if (cc) setCcAddresses(cc)
    if (bcc) setBccAddresses(bcc)
    if (subject) setSubject(subject)
    if (
      userProperties?.defaultAddress &&
      typeof userProperties.defaultAddress === 'string'
    )
      setFromAddress(userProperties.defaultAddress)
  })

  const queryMessageAndContentKeyId = useMemo(() => id, [])
  const title = useMemo(() => {
    if (!action || !queryMessageAndContentKeyId) return 'Write Mail'
    return (
      {
        forward: 'Forward Mail',
        reply: 'Reply Mail',
      }[action] || 'Edit Mail'
    )
  }, [action, queryMessageAndContentKeyId])
  useDocumentTitle(title)

  const messageInfoFromRouteState = locationState?.messageInfo
  const queryMessageInfoAndContentData = useQuery(
    [Query.GetMessageInfoAndContent, queryMessageAndContentKeyId],
    async () => {
      if (messageInfoFromRouteState) {
        return { messageInfo: messageInfoFromRouteState }
      }
      if (!queryMessageAndContentKeyId) {
        return { messageInfo: null }
      }
      const messageInfo = await catchApiResponse<GetMessage.Response>(
        api.getMessageInfo(queryMessageAndContentKeyId as string)
      )
      return {
        messageInfo,
      }
    },
    {
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  )

  const messageInfo = queryMessageInfoAndContentData?.data?.messageInfo
  const messageContent = messageInfo?.text

  const [isLoadedAttachments, setIsLoadedAttachments] = useState(false)
  useEffect(() => {
    if (isLoadedAttachments || !queryMessageInfoAndContentData.isSuccess) return
    setIsLoadedAttachments(true)
    if (messageInfo?.attachments) {
      loadAttachments(messageInfo.id, messageInfo.attachments)
    }
  }, [messageInfo, queryMessageInfoAndContentData.isSuccess])

  const defaultContent = useMemo(() => {
    const signContent =
      isEnableSignatureText && userProperties?.text_signature
        ? replaceSignContentUrlToATag(userProperties?.text_signature)
        : ''
    if (!messageContent) {
      return getDefaultTemplate(signContent)
    }
    const content = messageContent.html || messageContent.plain
    if (action === 'forward') {
      return getForwardTemplate(content, signContent)
    }
    if (action === 'reply') {
      return getReplyTemplate(content, signContent)
    }
    return content
  }, [
    messageContent,
    action,
    isEnableSignatureText,
    userProperties?.text_signature,
  ])
  const contentWithAttachmentImage = useMemo(() => {
    if (isLoadingAttachments || attachments.length === 0) return defaultContent
    return replaceHtmlAttachImageSrc(defaultContent, attachments)
  }, [defaultContent, isLoadingAttachments])

  if (!isAuth) {
    return redirectHome()
  }

  const isLoadingContent =
    isLoadingAttachments || !!queryMessageInfoAndContentData?.isLoading

  return (
    <>
      {/* <Head>
        <title>Mail3: {title}</title>
      </Head> */}
      <Box
        maxW={`${CONTAINER_MAX_WIDTH}px`}
        px={{
          base: '0',
          md: '20px',
        }}
        mx="auto"
      >
        <GotoInbox />
        <MessageEditor
          defaultContent={contentWithAttachmentImage}
          isEnableCardSignature={
            signatureStatus === SignatureStatus.OnlyImage ||
            signatureStatus === SignatureStatus.BothEnabled
          }
          isLoading={isLoadingContent}
        />
      </Box>
    </>
  )
}
