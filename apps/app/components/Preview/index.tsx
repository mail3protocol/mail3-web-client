import React, { useEffect, useMemo } from 'react'
import { Avatar, Button } from 'ui'
import { AvatarGroup, Box, Center, Text, Flex, Circle } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
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
import { useTranslation } from 'next-i18next'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import { GetMessage } from 'models/src/getMessage'
import { GetMessageContent } from 'models/src/getMessageContent'
import { interval, from as fromPipe, defer, switchMap, takeWhile } from 'rxjs'
import { SuspendButton, SuspendButtonType } from '../SuspendButton'
import { useAPI } from '../../hooks/useAPI'
import {
  MessageFlagAction,
  MessageFlagType,
  MailboxMessageDetailResponse,
  AddressResponse,
} from '../../api'
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
import { DRIFT_BOTTLE_ADDRESS, HOME_URL } from '../../constants'
import { RenderHTML } from './parser'
import { Query } from '../../api/query'
import { catchApiResponse } from '../../utils/api'
import { IpfsInfoTable } from '../IpfsInfoTable'

interface MeesageDetailState
  extends Pick<
    MailboxMessageDetailResponse,
    'date' | 'subject' | 'to' | 'from' | 'attachments' | 'cc' | 'bcc'
  > {}

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

  const router = useRouter()
  const toast = useToast()
  const { id, origin } = router.query as {
    id: string | undefined
    origin: string
  }
  const api = useAPI()
  const dialog = useDialog()
  const buttonTrack = useTrackClick(TrackEvent.ClickMailDetailsPageItem)
  const trackJoinDao = useTrackClick(TrackEvent.OpenJoinMail3Dao)
  const trackShowYourNft = useTrackClick(TrackEvent.OpenShowYourMail3NFT)
  const trackOpenDriftbottle = useTrackClick(TrackEvent.OpenDriftbottleMail)
  const { data } = useQuery(
    [Query.GetMessageInfoAndContent, id],
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
        info: messageInfo,
        html: messageContent?.html,
        plain: messageContent?.plain,
        messageInfo,
        messageContent,
      }
    },
    {
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
      onSuccess(d) {
        if (typeof id !== 'string') return
        const messageInfo = d.info
        if (messageInfo?.unseen) {
          if (
            messageInfo.from.address.startsWith('mail3dao.eth') &&
            messageInfo.subject.startsWith('Join Mail3 DAO!')
          ) {
            trackJoinDao()
          }
          if (
            messageInfo.from.address.startsWith('mail3.eth') &&
            messageInfo.subject.startsWith('Show your mail3')
          ) {
            trackShowYourNft()
          }
        }
        const isSeen = d.info?.flags.includes(MessageFlagType.Seen)
        const isFromDriftBottle = d.info?.from.address === DRIFT_BOTTLE_ADDRESS
        if (!isSeen && isFromDriftBottle) {
          trackOpenDriftbottle()
        }
        api.putMessage(id, MessageFlagAction.add, MessageFlagType.Seen)
      },
      enabled: typeof id === 'string',
    }
  )

  const detail: MeesageDetailState | undefined = useMemo(() => {
    if (data?.info) {
      const { date, subject, to, cc, from, attachments, bcc } = data.info

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
  }, [data])

  const content = useMemo(() => {
    if (data?.html) return data.html
    if (data?.plain) return data.plain.replace(/(\n)/g, '<br>')
    return ''
  }, [data])

  const isDriftBottleAddress = data?.info?.from.address === DRIFT_BOTTLE_ADDRESS

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
    !messageOnChainIdentifierError && !isLoadingMessageOnChainIdentifier

  useEffect(() => {
    const ipfsUrlIsEmtpyStr = messageOnChainIdentifierData?.url === ''
    const contentDigestIsEmtpyStr =
      messageOnChainIdentifierData?.contentDigest === ''
    if (ipfsUrlIsEmtpyStr && contentDigestIsEmtpyStr) {
      const subscriber = interval(2000)
        .pipe(
          switchMap(() =>
            fromPipe(defer(() => refetchMessageOnChainIdentifier()))
          ),
          takeWhile(
            (res) => res.data?.url === '' && res.data?.contentDigest === ''
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
        router.push({
          pathname: RoutePath.NewMessage,
          query: {
            id,
            action: 'reply',
          },
        })
      },
    },
    [SuspendButtonType.Forward]: {
      type: SuspendButtonType.Forward,
      onClick: () => {
        buttonTrack({
          [TrackKey.MailDetailPage]: MailDetailPageItem.Forward,
        })
        router.push({
          pathname: RoutePath.NewMessage,
          query: {
            id,
            action: 'forward',
          },
        })
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
          router.back()
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
              router.back()
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
          router.replace(`${RoutePath.Message}/${id}`)
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
  }, [api, id, origin, data?.info])

  const onClickAvatar = (address: string) => {
    const realAddress = removeMailSuffix(address).toLowerCase()
    window.location.href = `${HOME_URL}/${realAddress}`
  }

  const avatarList = useMemo(() => {
    if (!detail?.to) return []
    const exists: Array<string> = []

    let arr = [detail.from, ...detail.to]
    if (detail.cc) arr = [...arr, ...detail.cc]
    if (detail.bcc) arr = [...arr, ...detail.bcc]

    arr = arr.filter(({ address }) => {
      if (exists.includes(address.toLocaleLowerCase())) return false
      exists.push(address.toLocaleLowerCase())
      return true
    })
    return arr
  }, [detail])

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
            router.back()
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
                {detail.to ? (
                  <span>to {detail.to.map(getNameAddress).join('; ')}; </span>
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
          <PreviewContent>
            <RenderHTML
              html={content}
              attachments={detail.attachments}
              messageId={id}
              from={detail.from}
            />
          </PreviewContent>
          {detail.attachments ? (
            <Attachment data={detail.attachments} messageId={id} />
          ) : null}
          {isShowIpfsTable ? (
            <IpfsInfoTable
              ethAddress={messageOnChainIdentifierData?.owner_identifier}
              ipfs={messageOnChainIdentifierData?.url}
              contentDigest={messageOnChainIdentifierData?.contentDigest}
            />
          ) : null}
        </Box>
        {isDriftBottleAddress && driftBottleFrom ? (
          <Center pt="16px">
            <NextLink
              href={{
                pathname: RoutePath.NewMessage,
                query: {
                  force_to: driftBottleFrom,
                  id,
                  action: 'reply',
                  origin: 'driftbottle',
                },
              }}
              passHref
            >
              <Button
                as="a"
                variant="solid"
                bg="#4E52F5"
                _hover={{
                  bg: '#4E52F5',
                }}
              >
                {t('reply-driftbottle-sender')}
              </Button>
            </NextLink>
          </Center>
        ) : null}
      </Container>
    </>
  )
}
