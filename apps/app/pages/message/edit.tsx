import React, { useEffect, useMemo, useState } from 'react'
import { CONTAINER_MAX_WIDTH } from 'ui'
import { Box } from '@chakra-ui/react'
import { SubmitMessage } from 'models/src/submitMessage'
import { useAtomValue } from 'jotai'
import { SignatureStatus, useDidMount } from 'hooks'
import { useQuery } from 'react-query'
import { GetMessage } from 'models/src/getMessage'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GetMessageContent } from 'models/src/getMessageContent'
import { MessageEditor } from '../../components/MessageEditor'
import { useSubject } from '../../components/MessageEditor/hooks/useSubject'
import { userPropertiesAtom } from '../../hooks/useLogin'
import { useAttachment } from '../../components/MessageEditor/hooks/useAttachment'
import { useAPI } from '../../hooks/useAPI'
import { useSaveMessage } from '../../components/MessageEditor/hooks/useSaveMessage'
import { replaceHtmlAttachImageSrc } from '../../utils/editor'
import { DRIFT_BOTTLE_ADDRESS } from '../../constants'
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

function getDriftbottleTemplate(content: string, signContent: string) {
  return `<p>${content}
  <br>
  <br>
  ${signContent}
</p>`
}

function replaceSignContentUrlToATag(signContent: string) {
  return signContent.replace(
    isHttpUriNoBlankSpaceReg,
    (url) => `<a href="${url}">${url}</a>`
  )
}

export type Action = 'driftbottle' | SubmitMessage.ReferenceAction

export interface MessageData {
  messageInfo: GetMessage.Response
  messageContent: GetMessageContent.Response
}

export const NewMessagePage = () => {
  const [searchParams] = useSearchParams()
  const action = searchParams.get('action')
  const id = searchParams.get('id')
  const _to = searchParams.get('to')
  const _cc = searchParams.get('cc')
  const searchParamsSubject = searchParams.get('subject')
  const location = useLocation()
  const locationState = location.state as MessageData | undefined
  const to = _to ? filterEmails(_to.split(',')) : null
  const cc = _cc ? filterEmails(_cc.split(',')) : null
  const _forceTo = searchParams.get('force_to')
  const forceTo = _forceTo ? filterEmails(_forceTo.split(',')) : null
  const { isAuth, redirectHome } = useRedirectHome()
  const api = useAPI()
  const [t] = useTranslation('edit-message')
  const userProperties = useAtomValue(userPropertiesAtom)
  const signatureStatus = userProperties?.signature_status as SignatureStatus
  const isEnableSignatureText =
    signatureStatus === SignatureStatus.OnlyText ||
    signatureStatus === SignatureStatus.BothEnabled
  const [isLoadedSubjectInfo, setIsLoadedSubjectInfo] = useState(false)
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

  function getSubject(m?: GetMessage.Response | null) {
    if (searchParamsSubject) return searchParamsSubject
    if (!m) return ''
    if (
      (m.subject.startsWith('Fwd:') && action === 'forward') ||
      (m.subject.startsWith('Re:') && action === 'reply')
    ) {
      return m.subject
    }
    if (action === 'forward') {
      if (m.subject.startsWith('Re:')) {
        return `Fwd: ${m.subject.substring(4)}`
      }
      return `Fwd: ${m.subject}`
    }
    if (action === 'reply') {
      if (m.subject.startsWith('Fwd:')) {
        return `Re: ${m.subject.substring(5)}`
      }
      return `Re: ${m.subject}`
    }
    return m.subject
  }

  function getTo(m?: GetMessage.Response | null) {
    if (forceTo) {
      return forceTo
    }
    if (action === 'driftbottle') {
      return [DRIFT_BOTTLE_ADDRESS]
    }
    function getToAddressByMessageInfo() {
      if (!m || !m.to || action === 'forward') return []
      if (action === 'reply') return [m.from.address]
      return m.to.map((item) => item.address)
    }
    return getToAddressByMessageInfo().concat(to || [])
  }

  function setSubjectAndOtherByMessageInfo(m?: GetMessage.Response | null) {
    if (isLoadedSubjectInfo) return
    setIsLoadedSubjectInfo(true)
    if (userProperties?.defaultAddress) {
      setFromAddress(userProperties.defaultAddress as string)
    }
    setSubject(getSubject(m))
    setToAddresses(getTo(m))
    if (m && action === 'reply' && cc) {
      setCcAddresses(cc)
    }
    if (m && action !== 'reply' && action !== 'forward') {
      if (m.cc) {
        setCcAddresses(m.cc.map((item) => item.address))
      }
      if (m.bcc) {
        setBccAddresses(m.bcc.map((item) => item.address))
      }
    }
  }

  useDidMount(() => {
    onReset()
    onResetAttachments()
    onResetSavingAtom()
  })

  const title = useMemo(() => {
    if (action === null && id === null) {
      return 'Write Mail'
    }
    if (action === 'forward') {
      return 'Forward Mail'
    }
    if (action === 'reply') {
      return 'Reply Mail'
    }
    return 'Edit Mail'
  }, [action, id])
  useDocumentTitle(title)

  const queryMessageAndContentKeyId = useMemo(() => id, [])

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

  const [isFirstLoadMessage, setIsFirstLoadMessage] = useState(false)
  useEffect(() => {
    if (
      isFirstLoadMessage ||
      !queryMessageInfoAndContentData.isSuccess ||
      !messageInfo
    ) {
      return
    }
    setIsFirstLoadMessage(true)
    setSubjectAndOtherByMessageInfo(messageInfo)
    if (messageInfo?.attachments) {
      loadAttachments(messageInfo.id, messageInfo.attachments)
    }
  }, [messageInfo, queryMessageInfoAndContentData.isSuccess])

  useEffect(() => {
    if (id) return
    setToAddresses(getTo())
  }, [])

  const defaultContent = useMemo(() => {
    const signContent =
      isEnableSignatureText && userProperties?.text_signature
        ? replaceSignContentUrlToATag(userProperties?.text_signature)
        : ''
    if (action === 'driftbottle') {
      return getDriftbottleTemplate(t('drift_bottle_template'), signContent)
    }
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
