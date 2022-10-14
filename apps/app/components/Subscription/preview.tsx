import {
  Avatar,
  Box,
  Center,
  CloseButton,
  Divider,
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
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useDialog, useToast } from 'hooks'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { RenderHTML } from '../Preview/parser'
import { ReactComponent as SubscribeSvg } from '../../assets/subscription/subscribe.svg'
import { ReactComponent as UnsubscribeSvg } from '../../assets/subscription/unsubscribe.svg'
import { ReactComponent as ArtEmptySvg } from '../../assets/subscription/article-empty.svg'
import { useAPI } from '../../hooks/useAPI'
import { SubFormatDate } from '../../utils'

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
  overflow: hidden;
  overflow-y: scroll;
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

  @media (max-width: 768px) {
    &.not-single-mode {
      padding: 0;
      top: 143px;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 999;
      background-color: #fff;
      position: fixed;

      border-radius: 22px 22px 0px 0px;

      padding: 30px 30px 200px;

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

  if (isSingleMode)
    return (
      <Container className={isSingleMode ? 'single-mode' : 'not-single-mode'}>
        {children}
      </Container>
    )

  return (
    <>
      {isMobileOpen ? <Mask /> : null}
      <Container
        transform={
          !isMaxWdith600 || isMobileOpen ? 'translateY(0)' : 'translateY(100%)'
        }
        className={isSingleMode ? 'single-mode' : 'not-single-mode'}
      >
        {isMaxWdith600 ? (
          <Box position="absolute" top="20px" right="20px">
            <CloseButton
              onClick={() => {
                setIsOpen(false)
              }}
            />
          </Box>
        ) : null}
        {children}
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

  return (
    <Link
      fontWeight="400"
      fontSize="12px"
      lineHeight="18px"
      display="flex"
      onClick={async () => {
        if (isLoading) return
        setIsLoading(true)
        if (isFollow) {
          dialog({
            type: 'text',
            title: '',
            description: t('unsubscribe'),
            showCloseButton: true,
            onConfirm: async () => {
              await api.SubscriptionCommunityUserUnFollowing(uuid)
              setIsFollow(false)
              setIsLoading(false)
              toast(t('Unsubscribe successfully'), { status: 'success' })
            },
            onCancel: () => {},
            onClose: () => {},
            okText: 'Yes',
            cancelText: 'No',
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
          <Avatar w="32px" h="32px" />
          <Box ml="6px" fontWeight={600} fontSize="14px" lineHeight="26px">
            {detail?.writer_name}
          </Box>
          <Spacer />
          <SubscribeLink uuid={detail.writer_uuid} />
        </Flex>
        <Box fontWeight={500} fontSize="12px" color="#6F6F6F" mt="4px">
          {SubFormatDate(detail.created_at)}
        </Box>
        <Divider orientation="horizontal" mt="16px" />
      </Box>
      <Center className="mobile-header">
        <Avatar w="14px" h="14px" />
        <Box
          ml="6px"
          fontWeight={400}
          fontSize="12px"
          lineHeight="26px"
          color="#818181"
        >
          {detail.writer_name}
        </Box>
      </Center>
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
          color="#818181"
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
        />
      </Box>
      <Center className="mobile-button" w="100%" mt="20px">
        <Link fontWeight="400" fontSize="12px" lineHeight="18px" display="flex">
          <SubscribeLink uuid={detail.writer_uuid} />
        </Link>
      </Center>
    </Wrap>
  )
}
