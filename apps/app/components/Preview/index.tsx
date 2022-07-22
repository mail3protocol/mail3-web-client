import React, { useEffect, useMemo } from 'react'
import { Avatar, Button } from 'ui'
import { AvatarGroup, Box, Center, Text, Flex, Circle } from '@chakra-ui/react'
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
  ConfirmDialog,
  MailDetailPageItem,
  TrackEvent,
  TrackKey,
  useDialog,
  useToast,
  useTrackClick,
} from 'hooks'
import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { useAtomValue } from 'jotai'
import { GetMessage } from 'models/src/getMessage'
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
import { EmptyStatus } from '../MailboxStatus'
import {
  DRIFT_BOTTLE_ADDRESS,
  HOME_URL,
  OFFICE_ADDRESS_LIST,
} from '../../constants'
import { RenderHTML } from './parser'
import { Query } from '../../api/query'
import { catchApiResponse } from '../../utils/api'
import { userPropertiesAtom } from '../../hooks/useLogin'
import type { MeesageDetailState } from '../Mailbox'
import { IpfsInfoTable } from '../IpfsInfoTable'

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
    margin-top: 15px;
    margin-bottom: 15px;
  }

  img {
    display: inline;
  }
  /*
  a {
    text-decoration: underline;
    color: #3182ce;
  } */
`

export const PreviewComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const [t2] = useTranslation('common')

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

  const buttonTrack = useTrackClick(TrackEvent.ClickMailDetailsPageItem)
  const trackJoinDao = useTrackClick(TrackEvent.OpenJoinMail3Dao)
  const trackShowYourNft = useTrackClick(TrackEvent.OpenShowYourMail3NFT)
  const trackOpenDriftbottle = useTrackClick(TrackEvent.OpenDriftbottleMail)
  const trackOpenUpdateMail = useTrackClick(TrackEvent.OpenUpdateMail)

  const userProps = useAtomValue(userPropertiesAtom)
  const { data, isLoading: isLoadingContent } = useQuery(
    [Query.GetMessageInfoAndContent, id],
    async () => {
      const messageInfo = id
        ? await catchApiResponse<GetMessage.Response>(
            api.getMessageInfo(id as string)
          )
        : null
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

  const content = useMemo(() => {
    if (data?.html) return data.html
    if (data?.plain) return data.plain.replace(/(\n)/g, '<br>')
    return ''
  }, [data])

  const isDriftBottleAddress =
    data?.messageInfo?.from.address === DRIFT_BOTTLE_ADDRESS

  const driftBottleFrom = useMemo(() => getDriftBottleFrom(content), [content])

  const messageId = data?.messageInfo?.messageId
  const {
    data: messageOnChainIdentifierData,
    refetch: refetchMessageOnChainIdentifier,
    error: messageOnChainIdentifierError,
    isLoading: isLoadingMessageOnChainIdentifier,
  } = useQuery(
    [Query.GetMessageOnChainIdentifier, messageId],
    async () => {
      if (!messageId) return null
      return (await api.getMessageOnChainIdentifier(messageId)).data
    },
    {
      retry: false,
    }
  )

  const isShowIpfsTable =
    !messageOnChainIdentifierError &&
    !isLoadingMessageOnChainIdentifier &&
    !isLoadingContent

  useEffect(() => {
    const ipfsUrlIsEmtpyStr = messageOnChainIdentifierData?.url === ''
    const contentDigestIsEmtpyStr =
      messageOnChainIdentifierData?.content_digest === ''
    if (ipfsUrlIsEmtpyStr && contentDigestIsEmtpyStr) {
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

  const buttonConfig = {
    [SuspendButtonType.Reply]: {
      type: SuspendButtonType.Reply,
      isDisabled: isDriftBottleAddress,
      onClick: () => {
        buttonTrack({
          [TrackKey.MailDetailPage]: MailDetailPageItem.Reply,
        })
        navi(
          {
            pathname: RoutePath.NewMessage,
            search: createSearchParams({
              id,
              action: 'reply',
            }).toString(),
          },
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
      onClick: () => {
        buttonTrack({
          [TrackKey.MailDetailPage]: MailDetailPageItem.Forward,
        })
        navi(
          {
            pathname: RoutePath.NewMessage,
            search: createSearchParams({
              id,
              action: 'forward',
            }).toString(),
          },
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
        if (typeof id !== 'string') {
          return
        }
        try {
          await api.deleteMessage(id, { force: false })
          toast(t('status.trash.ok'), { status: 'success' })
          navi(-1)
        } catch (error) {
          toast(t('status.trash.fail'))
        }
      },
    },
    [SuspendButtonType.Delete]: {
      type: SuspendButtonType.Delete,
      onClick: () => {
        buttonTrack({
          [TrackKey.MailDetailPage]: MailDetailPageItem.Delete,
        })
        if (typeof id !== 'string') {
          return
        }

        dialog({
          type: 'text',
          title: t('confirm.delete.title'),
          description: t('confirm.delete.description'),
          okText: t2('button.yes'),
          cancelText: t2('button.cancel'),
          modalProps: {
            isOpen: false,
            onClose: () => {},
            size: 'md', // this size mobile is ugly, pc is better
            children: '',
          },
          onConfirm: async () => {
            try {
              await api.deleteMessage(id, { force: true })
              toast(t('status.delete.ok'))
              navi(-1)
            } catch (error) {
              toast(t('status.delete.fail'))
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
          await api.moveMessage(id, Mailboxes.INBOX)
          toast(t('status.restore.ok'))
          navi(`${RoutePath.Message}/${id}`, {
            replace: true,
          })
        } catch (error) {
          toast(t('status.restore.fail'))
        }
      },
    },
  }

  const buttonList = useMemo(() => {
    let list = [
      SuspendButtonType.Reply,
      SuspendButtonType.Forward,
      SuspendButtonType.Trash,
    ]

    if (origin === Mailboxes.Trash) {
      list = [SuspendButtonType.Restore, SuspendButtonType.Delete]
    }

    return list.map((key) => buttonConfig[key])
  }, [api, id, origin, data?.messageInfo])

  const onClickAvatar = (address: string) => {
    const realAddress = removeMailSuffix(address).toLowerCase()
    window.location.href = `${HOME_URL}/${realAddress}`
  }

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

  if (!id) {
    return (
      <Container>
        <EmptyStatus />
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
      <ConfirmDialog />
      <SuspendButton list={buttonList} />
      <Center position="relative">
        <Circle
          as="button"
          position="absolute"
          left="0px"
          border={{ base: 0, md: '2px solid #292D32' }}
          onClick={() => {
            navi(-1)
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
                  address={removeMailSuffix(address)}
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
            {detail.subject ? detail.subject : t('no-subject')}
          </Text>
        </Box>
        <Box>
          <Flex>
            <Box>
              {detail.from && (
                <Avatar
                  w="48px"
                  h="48px"
                  address={removeMailSuffix(detail.from.address)}
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
          borderBottom="1px solid #ccc"
        >
          {isLoadingContent ? (
            <Loading />
          ) : (
            <PreviewContent>
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
              {t('reply-driftbottle-sender')}
            </Button>
          </Center>
        ) : null}
      </Container>
    </>
  )
}
