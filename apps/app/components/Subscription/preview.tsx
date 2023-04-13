import {
  Box,
  Center,
  CloseButton,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  Link,
  Spacer,
  Spinner,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { atom, useAtom, useAtomValue } from 'jotai'
import { Subscription } from 'models'
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { TrackEvent, useDialog, useToast, useTrackClick } from 'hooks'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Avatar, EchoIframe, IpfsInfoTable } from 'ui'
import {
  isEthAddress,
  isPrimitiveEthAddress,
  truncateAddress,
  truncateMiddle,
} from 'shared'
import { ReactComponent as SvgDiamond } from 'assets/subscribe-page/diamond.svg'
import { RenderHTML } from '../Preview/parser'
import { ReactComponent as SubscribeSvg } from '../../assets/subscription/subscribe.svg'
import { ReactComponent as UnsubscribeSvg } from '../../assets/subscription/unsubscribe.svg'
import { ReactComponent as ArtEmptySvg } from '../../assets/subscription/article-empty.svg'
import { useAPI } from '../../hooks/useAPI'
import { SubFormatDate } from '../../utils'
import { APP_URL, HOME_URL } from '../../constants'
import { RoutePath } from '../../route/path'
import { userPropertiesAtom } from '../../hooks/useLogin'
import { ShareButtonGroup } from '../ShareButtonGroup'
import { BuyPremium } from '../SubscriptionArticleBody/buyPremium'

const Container = styled(Box)`
  width: 64.43%;
  height: 100%;
  padding: 32px;
  position: relative;

  .info {
    margin-top: 8px;
  }

  .mobile-button {
    display: none;
  }

  .mobile-header {
    display: none;
  }

  &.not-single-mode {
    .scroll-main-wrap {
      max-height: calc(100vh - 200px);
      overflow: hidden;
      overflow-y: scroll;
      position: relative;
      z-index: 8;

      &::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        display: none;
      }
    }
  }

  &.single-mode {
    width: 100%;
  }

  @media (max-width: 768px) {
    width: 100%;

    &.not-single-mode {
      overflow: hidden;
      height: auto;
      background-color: #fff;
      padding: 30px 20px 20px;

      .header {
        display: none;
      }

      .info {
        display: flex;
      }

      .mobile-button {
        display: flex;
      }

      .mobile-header {
        display: flex;
      }

      .scroll-main-wrap {
        height: auto;
        overflow: auto;
      }
    }

    &.single-mode {
      padding: 20px;
    }
  }
`

export const SubPreviewIdAtom = atom<string>('')
export const SubPreviewIsOpenAtom = atom<boolean>(false)

const Wrap: React.FC<{ isSingleMode: boolean } & PropsWithChildren> = ({
  children,
  isSingleMode,
}) => {
  const [isMaxWidth600] = useMediaQuery(`(max-width: 768px)`)
  const [isOpen, setIsOpen] = useAtom(SubPreviewIsOpenAtom)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
    } else {
      document.body.style.overflow = 'auto'
      document.body.style.height = 'auto'
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
  }, [isOpen, isMaxWidth600])

  if (isSingleMode)
    return <Container className="single-mode">{children}</Container>

  if (isMaxWidth600) {
    return (
      <Drawer
        placement="bottom"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        blockScrollOnMount={false}
      >
        <DrawerOverlay />
        <DrawerContent h="calc(100vh - 60px)">
          <DrawerBody p="0">
            <Container className="not-single-mode">
              <CloseButton
                position="absolute"
                top="20px"
                right="20px"
                zIndex={9}
                onClick={() => {
                  setIsOpen(false)
                }}
              />
              {children}
            </Container>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Container maxW="856px" className="not-single-mode">
      {children}
    </Container>
  )
}

export const SubscribeLink = ({ uuid }: { uuid: string }) => {
  const api = useAPI()
  const [t] = useTranslation('subscription')
  const [isFollow, setIsFollow] = useState(true)
  const dialog = useDialog()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const trackUnsubscribe = useTrackClick(TrackEvent.ClickUnsubscribe)

  return (
    <Link
      fontWeight="400"
      fontSize="12px"
      lineHeight="18px"
      display="flex"
      alignItems="center"
      onClick={async () => {
        trackUnsubscribe()

        if (isLoading) return
        setIsLoading(true)

        if (isFollow) {
          dialog({
            type: 'text',
            description: t('unsubscribe'),
            showCloseButton: true,
            modalBodyProps: {
              mt: '0',
            },
            modalCloseButtonProps: {
              zIndex: 9,
            },
            modalFooterProps: {
              pt: 0,
            },
            onConfirm: () => {
              setIsLoading(false)
            },
            onCancel: async () => {
              await api.SubscriptionCommunityUserUnFollowing(uuid)

              setIsFollow(false)
              setIsLoading(false)
              toast(t('Unsubscribe successfully'), { status: 'success' })
            },
            onClose: () => {
              setIsLoading(false)
            },
            okText: 'No',
            cancelText: 'Yes',
          })
        } else {
          await api.SubscriptionCommunityUserFollowing(uuid)
          setIsFollow(true)
          toast(t('Subscribe successfully'), { status: 'success' })
          setIsLoading(false)
        }
      }}
    >
      {isFollow ? (
        <>
          <UnsubscribeSvg /> Unsubscribe
        </>
      ) : (
        <>
          <SubscribeSvg /> Subscribe
        </>
      )}
    </Link>
  )
}

export const SubPreview: React.FC<{ isSingleMode: boolean }> = ({
  isSingleMode,
}) => {
  const [t] = useTranslation(['subscription-article'])
  const { id: _id } = useParams()
  const api = useAPI()
  const userProps = useAtomValue(userPropertiesAtom)
  const trackAvatar = useTrackClick(TrackEvent.ClickSubscribeNewsAvatar)
  let id = useAtomValue(SubPreviewIdAtom)
  if (_id) {
    id = _id
  }
  const {
    data: detail,
    isLoading,
    refetch,
  } = useQuery<Subscription.MessageDetailResp>(
    ['subscriptionDetail', id],
    async () => {
      const messageDetail = await api.SubscriptionMessageDetail(id)
      return messageDetail.data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!id,
    }
  )

  const { data: ipfsInfo } = useQuery(
    ['ipfsInfo', id],
    async () => {
      const ipfs = await api.getSubscribePageIpfsInfo(id)
      return ipfs.data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!id,
      retry: false,
    }
  )

  const nickname = useMemo(() => {
    const name = detail?.writer_name ?? ''
    if (isPrimitiveEthAddress(name)) {
      return truncateMiddle(name, 6, 4, '_')
    }
    if (isEthAddress(name)) {
      return name.includes('.') ? name.split('.')[0] : name
    }
    return name
  }, [detail?.writer_name])

  if (isLoading) {
    return (
      <Wrap isSingleMode={isSingleMode}>
        <Center minH="200px">
          <Spinner />
        </Center>
      </Wrap>
    )
  }

  if (!detail) {
    return (
      <Wrap isSingleMode={isSingleMode}>
        <Center minH="500px">
          <ArtEmptySvg />
        </Center>
      </Wrap>
    )
  }

  const isPremium = detail?.message_type === Subscription.MessageType.Premium
  const isNeedPay = isPremium && !detail.content

  return (
    <Wrap isSingleMode={isSingleMode}>
      <Box className="header">
        <Flex alignItems="center">
          <Link
            display="flex"
            href={`${APP_URL}/${detail?.writer_name}`}
            target="_blank"
            alignItems="center"
            onClick={() => {
              trackAvatar()
            }}
          >
            <Avatar
              w="32px"
              h="32px"
              address={detail?.writer_name}
              borderRadius="50%"
            />
            <Box ml="6px" fontWeight={600} fontSize="14px" lineHeight="26px">
              {truncateAddress(detail?.writer_name)}
            </Box>
          </Link>
          <Spacer />
          <ShareButtonGroup
            spacing="5px"
            shareUrl={`${APP_URL}/p/${id}`}
            text={detail.subject}
            iconW="22px"
            articleId={id}
          />
        </Flex>
        <Box fontWeight={500} fontSize="12px" color="#6F6F6F" mt="4px">
          {SubFormatDate(detail.created_at)}
        </Box>
        <Divider orientation="horizontal" mt="16px" />
      </Box>
      <Center
        className="mobile-header"
        onClick={() => {
          trackAvatar()
          window.open(`${HOME_URL}/${detail?.writer_name}`)
        }}
      >
        <Avatar
          w="14px"
          h="14px"
          address={detail?.writer_name}
          borderRadius="50%"
        />
        <Box
          ml="6px"
          fontWeight={400}
          fontSize="12px"
          lineHeight="26px"
          color="#6F6F6F"
        >
          {truncateAddress(detail?.writer_name)}
        </Box>
      </Center>
      <Box className="scroll-main-wrap">
        <Text
          fontWeight={700}
          fontSize={{ base: '28px', md: '32px' }}
          textAlign="center"
          pt={{ base: '15px', md: '20px' }}
        >
          {detail?.subject || 'no subject'}
        </Text>
        <Flex align="center" className="info">
          {isPremium ? (
            <Center
              w="118px"
              h={{ base: '18px', md: '24px' }}
              background="#FFF6D6"
              borderRadius="20px"
            >
              <Icon as={SvgDiamond} w="18px" h="18px" />
              <Box
                fontStyle="italic"
                fontWeight="600"
                fontSize="12px"
                lineHeight="14px"
                color="#FFA800"
              >
                {t('premium-only')}
              </Box>
            </Center>
          ) : null}
          <Spacer />
          <Box
            fontSize="12px"
            lineHeight="18px"
            whiteSpace="nowrap"
            color="#818181"
            display={{ base: 'block', md: 'none' }}
          >
            {SubFormatDate(detail.created_at)}
          </Box>
        </Flex>
        <Box>
          {detail?.summary ? (
            <Box
              mt="13px"
              background="#EBEBEB"
              borderRadius="12px"
              p="15px"
              overflow="hidden"
            >
              <Text
                fontWeight={{ base: '400', md: '500' }}
                fontSize={{ base: '12px', md: '16px' }}
                lineHeight={{ base: '18px', md: '24px' }}
                color="#333333"
              >
                {detail?.summary}
              </Text>
            </Box>
          ) : null}

          {isNeedPay ? (
            <BuyPremium
              bitAccount={detail.dot_bit_account}
              uuid={detail.writer_uuid}
              nickname={nickname}
              refetch={refetch}
            />
          ) : null}

          {detail?.content ? (
            <Box pt={{ base: '16px', md: '30px' }}>
              <RenderHTML
                html={detail.content}
                attachments={[]}
                messageId=""
                from={{ name: '', address: '' }}
                shadowStyle={`main { min-height: 400px; } img[style="max-width: 100%;"] { height: auto }`}
              />
              {ipfsInfo ? (
                <Box mt="8px">
                  <IpfsInfoTable
                    title={t('ipfs')}
                    ethAddress={ipfsInfo?.owner_identifier}
                    ipfs={ipfsInfo?.url}
                    contentDigest={ipfsInfo?.content_digest}
                  />
                </Box>
              ) : null}
              <Box mt="20px">
                <EchoIframe
                  targetUri={`${APP_URL}/${RoutePath.Subscription}/${id}`}
                  mailAddress={userProps?.defaultAddress}
                />
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
      <Center className="mobile-button" w="100%" mt="20px">
        <ShareButtonGroup
          spacing="20px"
          shareUrl={`${APP_URL}/p/${id}`}
          text={detail.subject}
          iconW="22px"
          articleId={id}
        />
      </Center>
    </Wrap>
  )
}
