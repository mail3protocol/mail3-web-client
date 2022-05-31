import React, { useCallback, useRef, useState } from 'react'
import { Box, Center, Circle, Flex, Spinner } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import styled from '@emotion/styled'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { Button, PageContainer } from 'ui'
import { atom, useAtom } from 'jotai'
import { useAPI } from '../../hooks/useAPI'
import { RoutePath } from '../../route/path'
import { MailboxMessageItemResponse } from '../../api'
import { Loading } from '../Loading'
import { InboxNav, InboxNavType } from './Nav'
import { Mailbox, AvatarBadgeType, ItemType, MessageItem } from '../Mailbox'
import { InfiniteHandle, InfiniteMailbox } from '../InfiniteMailbox'
import { EmptyStatus, NoNewStatus, ThisBottomStatus } from '../MailboxStatus'
import { BulkActionType, MailboxMenu, MailboxMenuType } from '../MailboxMenu'

import SVGWrite from '../../assets/mailbox/write.svg'

const PAGE_SIZE = 20

const NewPageContainer = styled(PageContainer)`
  @media (max-width: 600px) {
    padding: 0;
  }
`

export const MailboxContainer = styled(Box)`
  margin: 20px auto;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 24px;

  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
  }

  @media (max-width: 600px) {
    margin-top: 0px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: none;

    .title {
      padding-left: 20px;
      padding-top: 20px;
    }
  }
`

export const FlexButtonBox = styled(Flex)`
  justify-content: space-between;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    padding-left: 20px;

    .btn-write {
      bottom: 30px;
      left: 50%;
      width: 250px;
      transform: translateX(-50%);
      position: fixed;
      z-index: 99;
    }
  }
`

export const formatState = (
  data: Array<MailboxMessageItemResponse>,
  avatarBadgeType: AvatarBadgeType
): Array<MessageItem> =>
  data.map((item) => ({
    ...item,
    // ui need state
    isChoose: false,
    avatarBadgeType,
    itemType: ItemType.None,
  }))

type messagesState = Array<MessageItem> | null

const newMessagesAtom = atom<messagesState>(null)

export const InboxComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const api = useAPI()
  const router = useRouter()

  const [newPageIndex, setNewPageIndex] = useState(0)
  const [newMessages, setNewMessages] = useAtom(newMessagesAtom)
  const [surplus, setSurplus] = useState(0)

  const [seenMessages, setSeenMessages] = useState<messagesState>(null)
  const [seenIsFetching, setSeenIsFetching] = useState(true)

  const [isChooseMode, setIsChooseMode] = useState(false)
  const [chooseMap, setChooseMap] = useState<Record<string, boolean>>({})
  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>({})

  const refSeenBoxList = useRef<InfiniteHandle>(null)

  useQuery(
    ['getNewMessages', 'interval'],
    async () => {
      const { data } = await api.getMessagesNew(0)
      return data
    },
    {
      refetchInterval: 5000,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        if (!d.messages.length) {
          return
        }
        // TODO will be have bug when new mail to exceed page size
        // so, should be request alone api to get all new mails
        const oldMessages = newMessages ?? []
        const newItem = d.messages.filter((i) =>
          oldMessages.every((i2: { id: any }) => i2.id !== i.id)
        )
        if (!newItem.length) return
        const newDate = formatState(newItem, AvatarBadgeType.New)
        const newState = [...newDate, ...oldMessages]
        setSurplus(d.total - newState.length)
        setNewMessages(newState)
      },
    }
  )

  const { isFetching: newIsFetching } = useQuery(
    ['getNewMessages', newPageIndex],
    async () => {
      const { data } = await api.getMessagesNew(newPageIndex)
      return data
    },
    {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        if (!d.messages.length) {
          if (!newMessages) setNewMessages([])
          return
        }
        const oldMessages = newMessages || []
        const newItem = d.messages.filter((i) =>
          oldMessages.every((i2: { id: any }) => i2.id !== i.id)
        )
        const newDate = formatState(newItem, AvatarBadgeType.New)
        const newState = [...oldMessages, ...newDate]

        setSurplus(d.total - newState.length)
        setNewMessages(newState)
      },
    }
  )

  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getMessagesSeen(pageParam)
      return data
    },
    [api]
  )

  const setNewToSeen = (ids: Array<string>) => {
    if (!newMessages) return
    const targetMgs = ids.map((id) => {
      let retIndex = -1
      newMessages.some((_item, i) => {
        if (_item.id === id) {
          retIndex = i
          return true
        }
        return false
      })
      return retIndex
    })

    if (targetMgs.length) {
      const newState = [...newMessages]
      targetMgs.forEach((i) => {
        newState[i].avatarBadgeType = AvatarBadgeType.None
      })
      setNewMessages(newState)
    }
  }

  const isLoading =
    newIsFetching && seenIsFetching && !seenMessages && !newMessages
  const seenIsHidden = !seenMessages
  const isClear =
    !!newMessages &&
    !newMessages.length &&
    !!seenMessages &&
    !seenMessages.length
  const isNoNew =
    !!newMessages &&
    !newMessages.length &&
    !!seenMessages &&
    !!seenMessages.length

  return (
    <NewPageContainer>
      {isChooseMode && (
        <MailboxMenu
          type={MailboxMenuType.Base}
          actionMap={{
            [BulkActionType.Delete]: () => {
              const newIds =
                Object.keys(chooseMap).filter((key) => chooseMap[key]) ?? []
              const seenIds = refSeenBoxList?.current?.getChooseIds() ?? []
              const ids = [...newIds, ...seenIds]

              if (!ids.length) return

              api.batchDeleteMessage(ids).then(() => {
                if (newIds.length) {
                  const map: Record<string, boolean> = {}
                  newIds.forEach((key) => {
                    map[key] = true
                  })
                  setHiddenMap({
                    ...hiddenMap,
                    ...map,
                  })
                  setChooseMap({})
                  setIsChooseMode(false)
                }

                refSeenBoxList?.current?.setHiddenIds(seenIds)
              })
            },
          }}
          onClose={() => {
            // TODO rerender bug
            // setChooseMap({})
            // setIsChooseMode(false)
          }}
        />
      )}

      <Box paddingTop={{ base: '25px', md: '35px' }}>
        <FlexButtonBox>
          <InboxNav currentType={InboxNavType.Inbox} />
          <Button
            className="btn-write"
            onClick={() => {
              router.push(RoutePath.NewMessage)
            }}
          >
            <SVGWrite /> <Box ml="10px">Write</Box>
          </Button>
        </FlexButtonBox>

        <MailboxContainer minH="500px">
          <Box padding={{ md: '30px 64px', base: '0' }}>
            <Box className="title">{t('inbox.title.new')}</Box>
            {isClear && <EmptyStatus />}
            {isLoading && <Loading />}
            {isNoNew && <NoNewStatus />}
            {!!newMessages && (
              <Mailbox
                data={newMessages}
                isChooseMode={isChooseMode}
                setIsChooseMode={setIsChooseMode}
                onClickAvatar={(_i, id) => {
                  const newMap = { ...chooseMap }
                  newMap[id] = !newMap[id]
                  setChooseMap(newMap)
                }}
                chooseMap={chooseMap}
                hiddenMap={hiddenMap}
                onClickBody={(id) => {
                  setNewToSeen([id])
                  router.push(`${RoutePath.Message}/${id}`)
                }}
              />
            )}
            {surplus > 0 && (
              <Center>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewPageIndex(newPageIndex + 1)
                  }}
                >
                  {t('inbox.load-more')} +{PAGE_SIZE}
                </Button>
                <Circle size="40px" bg="black" color="white" marginLeft="10px">
                  {surplus}
                </Circle>
              </Center>
            )}
          </Box>

          <Box
            padding={{ base: 0, md: '20px 64px' }}
            bg="rgba(243, 243, 243, 0.4);"
            display={seenIsHidden ? 'none' : 'block'}
          >
            <Box className="title">{t('inbox.title.seen')}</Box>
            <InfiniteMailbox
              ref={refSeenBoxList}
              enableQuery
              queryFn={queryFn}
              queryKey={['Seen']}
              emptyElement=""
              loader={
                <Center w="100%">
                  <Spinner />
                </Center>
              }
              noMoreElement={<ThisBottomStatus />}
              onDataChange={(data) => {
                setSeenMessages(data)
              }}
              onGetIsFetching={(b) => {
                setSeenIsFetching(b)
              }}
              onChooseModeChange={(b) => {
                setIsChooseMode(b)
              }}
              parentIsChooseMode={isChooseMode}
              parentChooseMap={chooseMap}
              onClickBody={(id: string) => {
                router.push(`${RoutePath.Message}/${id}`)
              }}
            />
          </Box>
        </MailboxContainer>
      </Box>
    </NewPageContainer>
  )
}
