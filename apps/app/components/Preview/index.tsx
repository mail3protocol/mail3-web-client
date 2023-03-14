import React, { useEffect, useMemo } from 'react'
import { Avatar, Button, IpfsInfoTable } from 'ui'
import {
  AvatarGroup,
  Box,
  Center,
  Text,
  Flex,
  Circle,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useQuery } from 'react-query'
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import styled from '@emotion/styled'
import {
  MailDetailPageItem,
  TrackEvent,
  TrackKey,
  useDialog,
  useToast,
  useTrackClick,
} from 'hooks'
import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { useAtom, useAtomValue } from 'jotai'
import { interval, from as fromPipe, defer, switchMap, takeWhile } from 'rxjs'
import { SuspendButton, SuspendButtonType } from '../SuspendButton'
import { useAPI } from '../../hooks/useAPI'
import { MessageFlagAction, MessageFlagType, AddressResponse } from '../../api'
import { Mailboxes } from '../../api/mailboxes'
import { RoutePath } from '../../route/path'
import { Loading } from '../Loading'
import { Attachment } from './Attachment'
import {
  formatDateString,
  getDriftBottleFrom,
  isMail3Address,
  removeMailSuffix,
} from '../../utils'
import { EmptyStatus, NotFoundMessage } from '../MailboxStatus'
import {
  DRIFT_BOTTLE_ADDRESS,
  HOME_URL,
  MAIL_SERVER_URL,
  OFFICE_ADDRESS_LIST,
} from '../../constants'
import { RenderHTML } from './parser'
import { Query } from '../../api/query'
import { userPropertiesAtom } from '../../hooks/useLogin'
import type { MeesageDetailState } from '../Mailbox'
import { pinUpMsgAtom } from '../Inbox'
import { useExperienceUserGuard } from '../../hooks/useExperienceUserGuard'
import { generateMessageEditorUrl } from '../../utils/editor'

const Container = styled(Box)`
  margin: 25px auto 150px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 24px;
  padding: 40px 60px;

  @media (max-width: 600px) {
    border-radius: 0;
    box-shadow: none;
    padding: 0px;
    margin: 20px auto 130px;
  }
`

const PreviewContent = styled(Box)`
  p {
    margin-top: revert;
    margin-bottom: revert;
  }

  img {
    display: revert;
  }

  a {
    text-decoration: revert;
    color: #4d51f3;
  }

  ul,
  ol {
    padding-inline-start: revert;
    list-style-position: revert;
  }
`

export const PreviewComponent: React.FC = () => {
  const [i18Mailboxes] = useTranslation('mailboxes')
  const [i18Common] = useTranslation('common')
  const [i18Preview] = useTranslation('preview')

  const [searchParams] = useSearchParams()
  const { id: _id } = useParams()
  const id = _id as string
  const location = useLocation()
  const state = location.state as MeesageDetailState | undefined
  const navi = useNavigate()
  const origin = searchParams.get('origin')
  const toast = useToast()
  const api = useAPI()
  const dialog = useDialog()

  const isOriginSpam = origin === Mailboxes.Spam
  const isOriginTrash = origin === Mailboxes.Trash

  const buttonTrack = useTrackClick(TrackEvent.ClickMailDetailsPageItem)
  const trackJoinDao = useTrackClick(TrackEvent.OpenJoinMail3Dao)
  const trackShowYourNft = useTrackClick(TrackEvent.OpenShowYourMail3NFT)
  const trackOpenDriftbottle = useTrackClick(TrackEvent.OpenDriftbottleMail)
  const trackOpenUpdateMail = useTrackClick(TrackEvent.OpenUpdateMail)

  const [pinUpMsg, setPinUpMsg] = useAtom(pinUpMsgAtom)
  const userProps = useAtomValue(userPropertiesAtom)
  const {
    data,
    isLoading: isLoadingContent,
    error: errorFromGetMessage,
  } = useQuery(
    [Query.GetMessageInfoAndContent, id],
    async () => {
      const messageInfo = (await api.getMessageInfo(id as string))?.data
      return {
        html: messageInfo?.text.html,
        plain: messageInfo?.text.plain,
        messageInfo,
      }
    },
    {
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
      onSuccess(d) {
        const { messageInfo } = d
        if (messageInfo?.unseen) {
          const { from, subject } = messageInfo
          const { address } = from
          if (
            address.startsWith('mail3dao.eth') &&
            subject.includes('Join Mail3 DAO!')
          ) {
            trackJoinDao()
          }

          if (address.startsWith('mail3.eth')) {
            if (subject.includes('Show your mail3')) trackShowYourNft()
            if (subject.includes('Mail3 New Feature')) trackOpenUpdateMail()
          }

          const isFromDriftBottle = address === DRIFT_BOTTLE_ADDRESS
          if (isFromDriftBottle) trackOpenDriftbottle()

          api.putMessage(id, MessageFlagAction.add, MessageFlagType.Seen)
        }
      },
      enabled: typeof id === 'string',
    }
  )

  const content = useMemo(() => {
    if (data?.html) return data.html
    if (data?.plain) return data.plain.replace(/(\n)/g, '<br>')
    return ''
  }, [data])

  const detail: MeesageDetailState | undefined = useMemo(() => {
    if (state) {
      return state
    }
    if (data?.messageInfo) {
      const { date, subject, to, cc, from, attachments, bcc } = data.messageInfo

      return {
        date,
        subject,
        to,
        cc,
        from,
        attachments,
        bcc,
      }
    }
    return undefined
  }, [data?.messageInfo, state])

  const detailFull = data?.messageInfo

  const isBotCatchSpam = detailFull?.headers?.['x-spam-flag']

  const isDriftBottleAddress = detail?.from.address === DRIFT_BOTTLE_ADDRESS

  const driftBottleFrom = useMemo(() => getDriftBottleFrom(content), [content])

  const messageId = data?.messageInfo?.messageId
  const isOutsideEmailAddress = !data?.messageInfo?.from.address.endsWith(
    `@${MAIL_SERVER_URL}`
  )
  const {
    data: messageOnChainIdentifierData,
    refetch: refetchMessageOnChainIdentifier,
    error: messageOnChainIdentifierError,
    isLoading: isLoadingMessageOnChainIdentifier,
  } = useQuery(
    [Query.GetMessageOnChainIdentifier, messageId],
    async () => {
      if (!messageId || isOutsideEmailAddress) return null
      return (await api.getMessageOnChainIdentifier(messageId)).data
    },
    {
      retry: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const isShowIpfsTable =
    !isOutsideEmailAddress &&
    !messageOnChainIdentifierError &&
    !isLoadingMessageOnChainIdentifier &&
    !isLoadingContent

  useEffect(() => {
    const ipfsUrlIsEmptyStr = messageOnChainIdentifierData?.url === ''
    const contentDigestIsEmptyStr =
      messageOnChainIdentifierData?.content_digest === ''
    if (ipfsUrlIsEmptyStr && contentDigestIsEmptyStr) {
      const subscriber = interval(3000)
        .pipe(
          switchMap(() =>
            fromPipe(defer(() => refetchMessageOnChainIdentifier()))
          ),
          takeWhile(
            (res) => res.data?.url === '' && res.data?.content_digest === ''
          )
        )
        .subscribe()
      return () => {
        subscriber.unsubscribe()
      }
    }
    return () => {}
  }, [messageOnChainIdentifierData])

  const isSend: boolean = useMemo(() => {
    if (!detail || !userProps?.aliases) return false
    return userProps.aliases.some(
      (item: { address: string }) => item.address === detail.from.address
    )
  }, [userProps, detail])

  const { onAction: getIsAllowExperienceUserAction } = useExperienceUserGuard()

  const mailAddress: string = useMemo(
    () => userProps?.defaultAddress ?? 'unknown',
    [userProps]
  )

  const toMessage = useMemo(() => {
    const isOfficeMail = OFFICE_ADDRESS_LIST.some(
      (address) => detail?.from.address === address
    )

    if (isOfficeMail && detail && detail.to === null) {
      return [
        {
          address: mailAddress,
        },
      ]
    }

    return detail?.to || []
  }, [detail])

  const avatarList = useMemo(() => {
    if (!detail) return []
    const exists: Array<string> = []
    let arr = [detail.from, ...toMessage]
    if (detail.cc) arr = [...arr, ...detail.cc]
    if (detail.bcc) arr = [...arr, ...detail.bcc]

    arr = arr.filter(({ address }) => {
      if (exists.includes(address.toLocaleLowerCase())) return false
      exists.push(address.toLocaleLowerCase())
      return true
    })
    return arr
  }, [detail, toMessage])

  const replyAllList = useMemo(() => {
    if (!detail) return []
    const exists: Array<string> = [
      detail?.from.address,
      ...(userProps?.aliases.map((item: { address: string }) =>
        item.address.toLocaleLowerCase()
      ) || []),
    ]

    let arr = [...toMessage]
    if (detail.cc) arr = [...arr, ...detail.cc]

    arr = arr.filter(({ address }) => {
      if (exists.includes(address.toLocaleLowerCase())) return false
      exists.push(address.toLocaleLowerCase())
      return true
    })
    return arr.map((item) => item.address)
  }, [detail, toMessage, userProps?.aliases])

  const buttonConfig = {
    [SuspendButtonType.Reply]: {
      type: SuspendButtonType.Reply,
      isDisabled: isDriftBottleAddress,
      onClick: async () => {
        const isAllow = getIsAllowExperienceUserAction()
        if (!isAllow) return
        buttonTrack({
          [TrackKey.MailDetailPage]: MailDetailPageItem.Reply,
        })
        navi(
          generateMessageEditorUrl({
            action: 'reply',
            messageInfo: data?.messageInfo,
          }),
          {
            state: {
              messageInfo: data?.messageInfo,
            },
          }
        )
      },
    },
    [SuspendButtonType.ReplyAll]: {
      type: SuspendButtonType.ReplyAll,
      isDisabled: isDriftBottleAddress,
      onClick: async () => {
        buttonTrack({
          [TrackKey.MailDetailPage]: MailDetailPageItem.ReplyAll,
        })
        const isAllow = getIsAllowExperienceUserAction()
        if (!isAllow) return
        navi(
          generateMessageEditorUrl({
            action: 'reply',
            messageInfo: data?.messageInfo,
            cc: replyAllList,
          }),
          {
            state: {
              messageInfo: data?.messageInfo,
            },
          }
        )
      },
    },
    [SuspendButtonType.Forward]: {
      type: SuspendButtonType.Forward,
      onClick: async () => {
        buttonTrack({
          [TrackKey.MailDetailPage]: MailDetailPageItem.Forward,
        })
        const isAllow = getIsAllowExperienceUserAction()
        if (!isAllow) return
        navi(
          generateMessageEditorUrl({
            action: 'forward',
            messageInfo: data?.messageInfo,
          }),
          {
            state: {
              messageInfo: data?.messageInfo,
            },
          }
        )
      },
    },
    [SuspendButtonType.Trash]: {
      type: SuspendButtonType.Trash,
      onClick: async () => {
        buttonTrack({
          [TrackKey.MailDetailPage]: MailDetailPageItem.Trash,
        })
        const isAllow = getIsAllowExperienceUserAction()
        if (!isAllow) return
        if (typeof id !== 'string') {
          return
        }
        try {
          await api.deleteMessage(id, { force: false })
          setPinUpMsg([...pinUpMsg.filter((item) => item.id !== id)])
          toast(i18Mailboxes('status.trash.ok'), { status: 'success' })
          navi(-1)
        } catch (error) {
          toast(i18Mailboxes('status.trash.fail'))
        }
      },
    },
    [SuspendButtonType.Delete]: {
      type: SuspendButtonType.Delete,
      onClick: async () => {
        buttonTrack({
          [TrackKey.MailDetailPage]: MailDetailPageItem.Delete,
        })
        const isAllow = getIsAllowExperienceUserAction()
        if (!isAllow) return
        if (typeof id !== 'string') {
          return
        }

        dialog({
          type: 'text',
          title: i18Mailboxes('confirm.delete.title'),
          description: i18Mailboxes('confirm.delete.description'),
          okText: i18Common('button.yes'),
          cancelText: i18Common('button.cancel'),
          modalProps: {
            isOpen: false,
            onClose: () => {},
            size: 'md', // this size mobile is ugly, pc is better
            children: '',
          },
          onConfirm: async () => {
            try {
              await api.deleteMessage(id, { force: true })
              toast(i18Mailboxes('status.delete.ok'))
              navi(-1)
            } catch (error) {
              toast(i18Mailboxes('status.delete.fail'))
            }
          },
          onCancel: () => {},
        })
      },
    },
    [SuspendButtonType.Restore]: {
      type: SuspendButtonType.Restore,
      onClick: async () => {
        buttonTrack({
          [TrackKey.MailDetailPage]: MailDetailPageItem.Restore,
        })
        if (typeof id !== 'string') return
        try {
          await api.moveMessage(id, isSend ? Mailboxes.Sent : Mailboxes.INBOX)
          toast(i18Mailboxes('status.restore.ok'))
          navi(`${RoutePath.Message}/${id}`, {
            replace: true,
          })
        } catch (error) {
          toast(i18Mailboxes('status.restore.fail'))
        }
      },
    },
    [SuspendButtonType.Spam]: {
      type: SuspendButtonType.Spam,
      onClick: async () => {
        buttonTrack({
          [TrackKey.MailDetailPage]: MailDetailPageItem.Spam,
        })
        const isAllow = getIsAllowExperienceUserAction()
        if (!isAllow) return
        if (typeof id !== 'string') return
        try {
          await api.moveMessage(id, Mailboxes.Spam)
          setPinUpMsg([...pinUpMsg.filter((item) => item.id !== id)])
          toast(i18Mailboxes('status.spam.ok'))
          navi(-1)
        } catch (error) {
          toast(i18Mailboxes('status.spam.fail'))
        }
      },
    },
    [SuspendButtonType.NotSpam]: {
      type: SuspendButtonType.NotSpam,
      onClick: async () => {
        buttonTrack({
          [TrackKey.MailDetailPage]: MailDetailPageItem.NotSpam,
        })
        if (typeof id !== 'string') return
        try {
          await api.moveMessage(id, isSend ? Mailboxes.Sent : Mailboxes.INBOX)
          toast(i18Mailboxes('status.notSpam.ok'))
          navi(-1)
        } catch (error) {
          toast(i18Mailboxes('status.notSpam.fail'))
        }
      },
    },
  }

  const buttonList = useMemo(() => {
    let list: Array<
      | SuspendButtonType.Reply
      | SuspendButtonType.ReplyAll
      | SuspendButtonType.Forward
      | SuspendButtonType.Trash
      | SuspendButtonType.Spam
      | SuspendButtonType.Restore
      | SuspendButtonType.Delete
      | SuspendButtonType.NotSpam
    > =
      replyAllList.length > 0
        ? [
            SuspendButtonType.Reply,
            SuspendButtonType.ReplyAll,
            SuspendButtonType.Forward,
            SuspendButtonType.Trash,
            SuspendButtonType.Spam,
          ]
        : [
            SuspendButtonType.Reply,
            SuspendButtonType.Forward,
            SuspendButtonType.Trash,
            SuspendButtonType.Spam,
          ]

    if (isOriginTrash) {
      list = [
        SuspendButtonType.Restore,
        SuspendButtonType.Delete,
        SuspendButtonType.Spam,
      ]
    }

    if (isOriginSpam) {
      list = [SuspendButtonType.NotSpam, SuspendButtonType.Delete]
    }

    if (isSend) {
      list =
        replyAllList.length > 0
          ? [
              SuspendButtonType.Reply,
              SuspendButtonType.ReplyAll,
              SuspendButtonType.Forward,
              SuspendButtonType.Trash,
            ]
          : [
              SuspendButtonType.Reply,
              SuspendButtonType.Forward,
              SuspendButtonType.Trash,
            ]

      if (isOriginTrash) {
        list = [SuspendButtonType.Restore, SuspendButtonType.Delete]
      }

      if (isOriginSpam) {
        list = [SuspendButtonType.NotSpam, SuspendButtonType.Delete]
      }
    }

    return list.map((key) => buttonConfig[key])
  }, [api, id, origin, data?.messageInfo])

  const onClickAvatar = (address: string) => {
    const realAddress = removeMailSuffix(address).toLowerCase()
    window.location.href = `${HOME_URL}/${realAddress}`
  }

  if (!id) {
    return (
      <Container>
        <EmptyStatus />
      </Container>
    )
  }

  if (errorFromGetMessage) {
    return (
      <Container>
        <NotFoundMessage />
      </Container>
    )
  }

  if (!detail) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  const getNameAddress = (item: AddressResponse) => {
    const { address } = item
    if (item.name) return `${item.name} <${address}>`
    return `<${address}>`
  }

  return (
    <>
      <SuspendButton list={buttonList} />
      <Center position="relative">
        <Circle
          as="button"
          position="absolute"
          left="0px"
          border={{ base: 0, md: '2px solid #292D32' }}
          onClick={() => {
            if (window.history.length === 1) {
              navi(RoutePath.Inbox)
            } else {
              navi(-1)
            }
          }}
        >
          <ChevronLeftIcon w="26px" h="26px" />
        </Circle>
        <Box bg="#F3F3F3" padding="4px" borderRadius="47px">
          <AvatarGroup size="md" max={10}>
            {avatarList.map(({ address }) => (
              <Box
                key={address}
                {...(isMail3Address(address)
                  ? {
                      as: 'button',
                      onClick: () => {
                        onClickAvatar(address)
                      },
                    }
                  : {})}
              >
                <Avatar
                  w={{ base: '32px', md: '48px' }}
                  h={{ base: '32px', md: '48px' }}
                  address={address}
                  borderRadius="50%"
                />
              </Box>
            ))}
          </AvatarGroup>
        </Box>
      </Center>
      <Container>
        <Box>
          <Text
            align="center"
            fontWeight="700"
            fontSize={{ base: '20px', md: '28px' }}
            lineHeight={1.2}
            marginBottom="30px"
          >
            {detail.subject ? detail.subject : i18Mailboxes('no-subject')}
          </Text>
        </Box>
        <Box>
          <Flex>
            <Box>
              {detail.from && (
                <Avatar
                  w="48px"
                  h="48px"
                  address={detail.from.address}
                  borderRadius="50%"
                  {...(isMail3Address(detail.from.address)
                    ? {
                        onClick: () => {
                          onClickAvatar(detail.from.address)
                        },
                      }
                    : {})}
                />
              )}
            </Box>
            <Box
              borderBottom="1px solid #E7E7E7;"
              wordBreak="break-all"
              ml="15px"
              flexGrow={1}
            >
              <Flex
                lineHeight={1}
                alignItems="baseline"
                justify="space-between"
              >
                <Box>
                  {detail.from.name ? (
                    <Text
                      fontWeight={500}
                      fontSize={{ base: '20px', md: '24px' }}
                      lineHeight="1"
                      display="inline-block"
                      verticalAlign="bottom"
                    >
                      {detail.from.name}
                    </Text>
                  ) : null}
                  <Text
                    color="#6F6F6F"
                    fontWeight={400}
                    fontSize={{ base: '12px', md: '16px' }}
                    display={{ base: 'block', md: 'inline-block' }}
                    ml={{ base: 0, md: '5px' }}
                    mt={{ base: '5px', md: 0 }}
                  >
                    {`<${detail.from.address}>`}
                  </Text>
                </Box>
                <Box />
                <Box
                  display={{ base: 'none', md: 'block' }}
                  fontWeight={500}
                  fontSize="16px"
                  color="#6F6F6F"
                  whiteSpace="nowrap"
                >
                  {detail.date && formatDateString(detail.date)}
                </Box>
              </Flex>
              <Box
                fontWeight={400}
                fontSize={{ base: '12px', md: '16px' }}
                color="#6F6F6F"
                lineHeight={{ base: '16px', md: '24px' }}
                marginTop={{ base: '12px', md: '5px' }}
              >
                {toMessage.length ? (
                  <span>to {toMessage.map(getNameAddress).join('; ')}; </span>
                ) : null}
                {detail.cc ? (
                  <span>cc {detail.cc.map(getNameAddress).join('; ')}; </span>
                ) : null}
                {detail.bcc ? (
                  <span>bcc {detail.bcc.map(getNameAddress).join(';')};</span>
                ) : null}
              </Box>

              <Box
                display={{ base: 'block', md: 'none' }}
                fontWeight={500}
                fontSize="12px"
                mt="10px"
                color="#6F6F6F"
                whiteSpace="nowrap"
              >
                {formatDateString(detail.date)}
              </Box>
            </Box>
          </Flex>
        </Box>
        <Box
          padding={{ base: '20px 0', md: '20px 24px 65px 24px' }}
          pointerEvents={isOriginSpam ? 'none' : 'auto'}
        >
          {isLoadingContent ? (
            <Loading />
          ) : (
            <PreviewContent>
              {isOriginSpam ? (
                <Alert
                  status="error"
                  backgroundColor="#FFE2E2"
                  borderRadius="6px"
                >
                  <AlertIcon />
                  <Box color="#DA4444">
                    <AlertTitle fontSize="14px">
                      {i18Preview(
                        isBotCatchSpam ? 'spam_title.bot' : 'spam_title.user'
                      )}
                    </AlertTitle>
                    <AlertDescription fontSize="12px">
                      {i18Preview(
                        isBotCatchSpam
                          ? 'spam_content.bot'
                          : 'spam_content.user'
                      )}
                    </AlertDescription>
                  </Box>
                </Alert>
              ) : null}
              <RenderHTML
                html={content}
                attachments={detail.attachments}
                messageId={id}
                from={detail.from}
              />
            </PreviewContent>
          )}
          {detail.attachments ? (
            <Attachment data={detail.attachments} messageId={id} />
          ) : null}
          {isShowIpfsTable ? (
            <IpfsInfoTable
              title={i18Preview('ipfs')}
              ethAddress={messageOnChainIdentifierData?.owner_identifier}
              ipfs={messageOnChainIdentifierData?.url}
              contentDigest={messageOnChainIdentifierData?.content_digest}
            />
          ) : null}
        </Box>
        {isDriftBottleAddress && driftBottleFrom ? (
          <Center pt="16px">
            <Button
              variant="solid"
              bg="#4E52F5"
              _hover={{
                bg: '#4E52F5',
              }}
              onClick={() => {
                const search = createSearchParams({
                  force_to: driftBottleFrom,
                  id,
                  action: 'reply',
                  origin: 'driftbottle',
                }).toString()
                navi({
                  pathname: RoutePath.NewMessage,
                  search,
                })
              }}
            >
              {i18Mailboxes('reply-driftbottle-sender')}
            </Button>
          </Center>
        ) : null}
      </Container>
    </>
  )
}
