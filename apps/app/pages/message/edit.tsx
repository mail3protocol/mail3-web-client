import React, { useEffect, useMemo, useState } from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CONTAINER_MAX_WIDTH } from 'ui'
import { Box } from '@chakra-ui/react'
import { GetMessage } from 'models/src/getMessage'
import { GetMessageContent } from 'models/src/getMessageContent'
import { SubmitMessage } from 'models/src/submitMessage'
import { MessageEditor } from '../../components/MessageEditor'
import { Navbar } from '../../components/Navbar'
import { API, UserResponse } from '../../api'
import { useSubject } from '../../components/MessageEditor/hooks/useSubject'
import { getAuthenticateProps, parseCookies } from '../../hooks/useLogin'
import {
  AttachmentExtraInfo,
  useAttachment,
} from '../../components/MessageEditor/hooks/useAttachment'
import { useAPI } from '../../hooks/useAPI'
import { convertBlobToBase64 } from '../../utils/file'
import { useSaveMessage } from '../../components/MessageEditor/hooks/useSaveMessage'

interface ServerSideProps {
  userInfo: UserResponse
  messageInfo: GetMessage.Response | null
  messageContent: GetMessageContent.Response | null
  action: SubmitMessage.ReferenceAction | null
}

function catchApiError<T>(fn: Promise<T>) {
  return fn.catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err.response)
    return null
  })
}

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

export const getServerSideProps: GetServerSideProps<ServerSideProps> =
  getAuthenticateProps(async ({ locale, req, query }) => {
    const cookies = parseCookies(req) as {
      address?: string
      jwt?: string
    }
    const address = cookies?.address
    const jwt = cookies?.jwt
    const api = new API(address, jwt)
    const { data: userInfo } = await api.getUserInfo()
    const messageInfo = query.id
      ? await catchApiError(
          api.getMessageInfo(query.id as string).then((r) => r.data)
        )
      : null
    const messageContent = messageInfo?.text?.id
      ? await catchApiError(
          api.getMessageContent(messageInfo.text.id).then((r) => r.data)
        )
      : null
    return {
      props: {
        ...(await serverSideTranslations(locale as string, [
          'edit-message',
          'connect',
          'common',
        ])),
        userInfo,
        messageInfo,
        messageContent,
        action: query.action ? query.action : null,
      },
    }
  })

const NewMessagePage: NextPage<ServerSideProps> = ({
  userInfo,
  messageInfo,
  messageContent,
  action,
}) => {
  const defaultContent = useMemo(() => {
    const signContent =
      userInfo.text_sig_state === 'enabled' ? userInfo.text_signature : ''
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
  }, [messageContent, action])
  const [isLoadedSubjectInfo, setIsLoadingSubjectInfo] = useState(false)
  const {
    setSubject,
    setToAddresses,
    setCcAddresses,
    setBccAddresses,
    setFromAddress,
    onReset,
  } = useSubject()
  const { setAttachmentExtraInfo, setAttachments, onResetAttachments } =
    useAttachment()
  const { onResetSavingAtom } = useSaveMessage()
  const api = useAPI()
  const getSubject = () => {
    if (!messageInfo) return ''
    if (
      (messageInfo.subject.startsWith('Fwd:') && action === 'forward') ||
      (messageInfo.subject.startsWith('Re:') && action === 'reply')
    ) {
      return messageInfo.subject
    }
    if (action === 'forward' && messageInfo.subject.startsWith('Re:')) {
      return `Fwd:${messageInfo.subject.substring(3)}`
    }
    if (action === 'reply' && messageInfo.subject.startsWith('Fwd:')) {
      return `Re:${messageInfo.subject.substring(4)}`
    }
    return messageInfo.subject
  }
  useEffect(() => {
    if (isLoadedSubjectInfo) return
    onReset()
    onResetAttachments()
    onResetSavingAtom()
    setIsLoadingSubjectInfo(true)
    if (!messageInfo) return
    setSubject(getSubject())
    if (messageInfo.to) {
      setToAddresses(messageInfo.to.map((item) => item.address))
    }
    if (messageInfo.cc) {
      setCcAddresses(messageInfo.cc.map((item) => item.address))
    }
    if (messageInfo.bcc) {
      setBccAddresses(messageInfo.bcc.map((item) => item.address))
    }
    if (messageInfo.from) {
      setFromAddress(messageInfo.from.address)
    }
    ;(async () => {
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
        messageInfo.attachments.reduce<{ [key: string]: AttachmentExtraInfo }>(
          (acc, cur) => ({ ...acc, [cur.contentId]: { downloadProgress: 0 } }),
          {}
        )
      )
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
                // eslint-disable-next-line no-param-reassign
                a[i].content = base64
                return a.concat([])
              })
            })
        )
      )
    })()
  }, [])
  return (
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
        defaultContent={defaultContent}
        isEnableCardSignature={userInfo.card_sig_state === 'enabled'}
      />
    </Box>
  )
}

export default NewMessagePage
