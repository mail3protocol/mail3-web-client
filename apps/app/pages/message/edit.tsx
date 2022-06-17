import React, { useMemo, useState } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CONTAINER_MAX_WIDTH } from 'ui'
import { Box } from '@chakra-ui/react'
import { SubmitMessage } from 'models/src/submitMessage'
import { useAtomValue } from 'jotai'
import { SignatureStatus, useDidMount } from 'hooks'
import { useQuery } from 'react-query'
import { GetMessage } from 'models/src/getMessage'
import Head from 'next/head'
import { GetMessageContent } from 'models/src/getMessageContent'
import { MessageEditor } from '../../components/MessageEditor'
import { Navbar } from '../../components/Navbar'
import { useSubject } from '../../components/MessageEditor/hooks/useSubject'
import { getAuthenticateProps, userPropertiesAtom } from '../../hooks/useLogin'
import {
  AttachmentExtraInfo,
  useAttachment,
} from '../../components/MessageEditor/hooks/useAttachment'
import { useAPI } from '../../hooks/useAPI'
import { convertBlobToBase64 } from '../../utils/file'
import { useSaveMessage } from '../../components/MessageEditor/hooks/useSaveMessage'
import { replaceHtmlAttachImageSrc } from '../../utils/editor'
import { Query } from '../../api/query'
import { catchApiResponse } from '../../utils/api'

function getDefaultTemplate(content: string) {
  return `<p>
<br/>
<br/>
<br/>
${content}
</p>`
}

function getReplyTemplate(content: string, signContent: string) {
  return getDefaultTemplate(`<blockquote style="border-left: 2px solid #6f6f6f; background-color: #f7f7f7; padding: 16px 20px">
${content}
</blockquote>
<br/>
<br/>
${signContent}`)
}

function getForwardTemplate(content: string, signContent: string) {
  return getDefaultTemplate(`<blockquote style="background-color: #f7f7f7; padding: 16px 20px">
<p>---------- Forwarded message ---------</p>
${content}
</blockquote>
<br/>
<br/>
${signContent}
`)
}

interface ServerSideProps {
  action: SubmitMessage.ReferenceAction | null
  id: string | null
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> =
  getAuthenticateProps(async ({ locale, query }) => ({
    props: {
      ...(await serverSideTranslations(locale as string, [
        'edit-message',
        'connect',
        'common',
      ])),
      action: query.action ? query.action : null,
      id: query.id ? query.id : null,
    },
  }))

const NewMessagePage: NextPage<ServerSideProps> = ({ action, id }) => {
  const api = useAPI()
  const userProperties = useAtomValue(userPropertiesAtom)
  const signatureStatus = userProperties?.signature_status as SignatureStatus
  const isEnableSignatureText =
    signatureStatus === SignatureStatus.OnlyText ||
    signatureStatus === SignatureStatus.BothEnabled
  const [isLoadedSubjectInfo, setIsLoadedSubjectInfo] = useState(false)
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false)
  const {
    setSubject,
    setToAddresses,
    setCcAddresses,
    setBccAddresses,
    setFromAddress,
    onReset,
  } = useSubject()
  const {
    setAttachmentExtraInfo,
    setAttachments,
    onResetAttachments,
    attachments,
  } = useAttachment()
  const { onResetSavingAtom } = useSaveMessage()

  function getSubject(messageInfo: GetMessage.Response) {
    if (!messageInfo) return ''
    if (
      (messageInfo.subject.startsWith('Fwd:') && action === 'forward') ||
      (messageInfo.subject.startsWith('Re:') && action === 'reply')
    ) {
      return messageInfo.subject
    }
    if (action === 'forward') {
      if (messageInfo.subject.startsWith('Re:')) {
        return `Fwd: ${messageInfo.subject.substring(4)}`
      }
      return `Fwd: ${messageInfo.subject}`
    }
    if (action === 'reply') {
      if (messageInfo.subject.startsWith('Fwd:')) {
        return `Re: ${messageInfo.subject.substring(5)}`
      }
      return `Re: ${messageInfo.subject}`
    }
    return messageInfo.subject
  }

  function getTo(messageInfo: GetMessage.Response) {
    if (!messageInfo.to || action === 'forward') {
      return []
    }
    if (action === 'reply') {
      return [messageInfo.from.address]
    }
    return messageInfo.to.map((item) => item.address)
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
      return 'Foward Mail'
    }
    if (action === 'reply') {
      return 'Reply Mail'
    }
    return 'Edit Mail'
  }, [action, id])

  const queryMessageAndContentKeyId = useMemo(() => id, [])

  const queryMessageInfoAndContentData = useQuery(
    [Query.GetMessageInfoAndContent, queryMessageAndContentKeyId],
    async () => {
      const messageInfo = id
        ? await catchApiResponse<GetMessage.Response>(
            api.getMessageInfo(id as string)
          )
        : null
      const messageContent = messageInfo?.text.id
        ? await catchApiResponse<GetMessageContent.Response>(
            api.getMessageContent(messageInfo?.text.id)
          )
        : null
      return {
        messageInfo,
        messageContent,
      }
    },
    {
      enabled: !!queryMessageAndContentKeyId,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      async onSuccess(d) {
        const { messageInfo } = d
        if (isLoadedSubjectInfo) return
        setIsLoadedSubjectInfo(true)
        if (userProperties?.defaultAddress) {
          setFromAddress(userProperties.defaultAddress as string)
        }
        if (!messageInfo) return
        setSubject(getSubject(messageInfo))
        setToAddresses(getTo(messageInfo))
        if (action !== 'reply' && action !== 'forward') {
          if (messageInfo.cc) {
            setCcAddresses(messageInfo.cc.map((item) => item.address))
          }
          if (messageInfo.bcc) {
            setBccAddresses(messageInfo.bcc.map((item) => item.address))
          }
        }
        if (!messageInfo.attachments) return
        setAttachments(
          messageInfo.attachments.map((a) => ({
            filename: a.filename,
            contentType: a.contentType,
            cid: a.contentId,
            content: '',
            contentDisposition: a.inline ? 'inline' : 'attachment',
          }))
        )
        setAttachmentExtraInfo(
          messageInfo.attachments.reduce<{
            [key: string]: AttachmentExtraInfo
          }>(
            (acc, cur) => ({
              ...acc,
              [cur.contentId]: { downloadProgress: 0 },
            }),
            {}
          )
        )
        setIsLoadingAttachments(true)
        await Promise.all(
          messageInfo.attachments.map((attachment, i) =>
            api
              .downloadAttachment(messageInfo.id, attachment.id)
              .then((res) => convertBlobToBase64(res.data))
              .then((base64) => {
                setAttachmentExtraInfo((o) => ({
                  ...o,
                  [attachment.contentId]: { downloadProgress: 1 },
                }))
                setAttachments((a) => {
                  // eslint-disable-next-line no-param-reassign,prefer-destructuring
                  a[i].content = base64.split(',')[1]
                  return a.concat([])
                })
              })
              .catch(() => {})
          )
        )
        setIsLoadingAttachments(false)
      },
    }
  )

  const messageContent = queryMessageInfoAndContentData?.data?.messageContent
  const defaultContent = useMemo(() => {
    const signContent =
      isEnableSignatureText && userProperties?.text_signature
        ? userProperties?.text_signature
        : ''
    if (!messageContent) {
      return getDefaultTemplate(signContent)
    }
    if (action === 'forward') {
      return getForwardTemplate(messageContent.html, signContent)
    }
    if (action === 'reply') {
      return getReplyTemplate(messageContent.html, signContent)
    }
    return messageContent.html
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

  return (
    <>
      <Head>
        <title>Mail3: {title}</title>
      </Head>
      <Box
        maxW={`${CONTAINER_MAX_WIDTH}px`}
        px={{
          base: '0',
          md: '20px',
        }}
        mx="auto"
      >
        <Box
          w="full"
          px={{
            base: '20px',
            md: '0',
          }}
        >
          <Navbar />
        </Box>
        <MessageEditor
          defaultContent={contentWithAttachmentImage}
          isEnableCardSignature={
            signatureStatus === SignatureStatus.OnlyImage ||
            signatureStatus === SignatureStatus.BothEnabled
          }
          isLoading={
            queryMessageInfoAndContentData.isLoading || isLoadingAttachments
          }
        />
      </Box>
    </>
  )
}

export default NewMessagePage
