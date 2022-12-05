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
  Link,
  Spacer,
  Spinner,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { atom, useAtom, useAtomValue } from 'jotai'
import { Subscription } from 'models'
import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { TrackEvent, useDialog, useToast, useTrackClick } from 'hooks'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Avatar, EchoIframe } from 'ui'
import { truncateAddress } from 'shared'
import { RenderHTML } from '../Preview/parser'
import { ReactComponent as SubscribeSvg } from '../../assets/subscription/subscribe.svg'
import { ReactComponent as UnsubscribeSvg } from '../../assets/subscription/unsubscribe.svg'
import { ReactComponent as ArtEmptySvg } from '../../assets/subscription/article-empty.svg'
import { useAPI } from '../../hooks/useAPI'
import { SubFormatDate } from '../../utils'
import { APP_URL, HOME_URL } from '../../constants'
import { RoutePath } from '../../route/path'
import { userPropertiesAtom } from '../../hooks/useLogin'

const Mask = styled(Box)`
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  position: fixed;
  display: none;
  background-color: rgba(0, 0, 0, 0.5);
  @media (max-width: 768px) {
    display: block;
  }
`

const Container = styled(Box)`
  flex: 16;
  height: 100%;
  padding: 32px;
  position: relative;

  .info {
    margin-top: 18px;
    display: none;
  }

  .mobile-button {
    display: none;
  }

  .mobile-header {
    display: none;
  }

  &.not-single-mode {
    .scroll-main-wrap {
      max-height: calc(100vh - 300px);
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

  @media (max-width: 768px) {
    &.not-single-mode {
      overflow: hidden;
      height: auto;
      padding: 0;
      /* top: 143px; */
      /* right: 0;
      bottom: 0;
      left: 0; */
      /* z-index: 999; */
      background-color: #fff;
      /* position: fixed; */

      /* border-radius: 22px 22px 0px 0px; */

      padding: 30px 30px 20px;

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

const Wrap: React.FC<{ isSingleMode: boolean }> = ({
  children,
  isSingleMode,
}) => {
  const [isMaxWdith600] = useMediaQuery(`(max-width: 768px)`)
  const [isOpen, setIsOpen] = useAtom(SubPreviewIsOpenAtom)
  const isMobileOpen = isMaxWdith600 && isOpen

  useEffect(() => {
    if (!isMaxWdith600 && !isSingleMode) {
      document.body.style.overflow = 'hidden'
      return
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
    } else {
      document.body.style.overflow = 'auto'
      document.body.style.height = 'auto'
    }
  }, [isOpen, isMaxWdith600])

  if (isSingleMode)
    return <Container className="single-mode">{children}</Container>

  if (isMaxWdith600) {
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
        <DrawerContent h="calc(100vh - 180px)">
          <DrawerBody p="0">
            <Container className="not-single-mode">
              <Box
                position="absolute"
                top="20px"
                right="20px"
                zIndex={9}
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                <CloseButton />
              </Box>
              {children}
            </Container>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <>
      {isMobileOpen ? <Mask /> : null}
      <Container
        maxW="856px"
        transform={
          !isMaxWdith600 || isMobileOpen ? 'translateY(0)' : 'translateY(100%)'
        }
        className={isSingleMode ? 'single-mode' : 'not-single-mode'}
      >
        {isMaxWdith600 ? (
          <Box
            position="absolute"
            top="20px"
            right="20px"
            zIndex={9}
            onClick={() => {
              setIsOpen(false)
            }}
          >
            <CloseButton />
          </Box>
        ) : null}
        <Box>{children}</Box>
      </Container>
    </>
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
  const { id: _id } = useParams()
  const api = useAPI()
  const userProps = useAtomValue(userPropertiesAtom)
  const trackAvatar = useTrackClick(TrackEvent.ClickSubscribeNewsAvatar)
  let id = useAtomValue(SubPreviewIdAtom)
  if (_id) {
    id = _id
  }
  const { data, isLoading } = useQuery<Subscription.MessageDetailResp>(
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

  const detail = useMemo(() => data, [data])

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

  return (
    <Wrap isSingleMode={isSingleMode}>
      <Box className="header">
        <Flex alignItems="center">
          <Link
            display="flex"
            href={`${HOME_URL}/${detail?.writer_name}`}
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
          <SubscribeLink uuid={detail.writer_uuid} />
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
          fontSize={{ base: '16px', md: '28px' }}
          textAlign="center"
          pt={{ base: '15px', md: '20px' }}
        >
          {detail?.subject || 'no subject'}
        </Text>
        <Flex align="center" className="info">
          <Divider orientation="horizontal" />
          <Box
            p="0px 50px"
            fontSize="12px"
            lineHeight="26px"
            whiteSpace="nowrap"
            color="#6F6F6F"
          >
            {SubFormatDate(detail.created_at)}
          </Box>
          <Divider orientation="horizontal" />
        </Flex>
        <Box pt={{ base: '16px', md: '30px' }}>
          <RenderHTML
            html={detail?.content}
            attachments={[]}
            messageId=""
            from={{ name: '', address: '' }}
            shadowStyle={`main { min-height: 400px; } img[style="max-width: 100%;"] { height: auto }`}
          />
          <EchoIframe
            targetUri={`${APP_URL}/${RoutePath.Subscription}/${id}`}
            mailAddress={userProps?.defaultAddress}
          />
        </Box>
      </Box>
      <Center className="mobile-button" w="100%" mt="20px">
        <Link fontWeight="400" fontSize="12px" lineHeight="18px" display="flex">
          <SubscribeLink uuid={detail.writer_uuid} />
        </Link>
      </Center>
    </Wrap>
  )
}
