/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useRef, useState } from 'react'
import { Box, Center, Circle, Flex, SlideFade } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import styled from '@emotion/styled'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { Button, PageContainer } from 'ui'
import { useAPI } from '../../hooks/useAPI'
import { RoutePath } from '../../route/path'
import { MessageItemResponse } from '../../api'
import { Loading } from '../Loading'
import { InboxNav, InboxNavType } from './Nav'
import { Mailbox, AvatarBadgeType, ItemType, MessageItem } from '../Mailbox'
import { InfiniteHandle, InfiniteMailbox } from '../InfiniteMailbox'
import { EmptyStatus, NoNewStatus, ThisBottomStatus } from '../MailboxStatus'
import SVGWrite from '../../assets/icon-write.svg'
import { BulkActionType, MailboxMenu, MailboxMenuType } from '../MailboxMenu'

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
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: none;
  }
`

export const FlexButtonBox = styled(Flex)`
  justify-content: space-between;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    justify-content: normal;
    align-items: center;

    .btn-write {
      margin-bottom: 20px;
      margin-right: 20px;
      align-self: flex-end;
    }
  }
`

export const formatState = (
  data: Array<MessageItemResponse>,
  avatarBadgeType: AvatarBadgeType
): Array<MessageItem> =>
  data.map((item) => {
    const { subject, unseen, messageId, date, from, to, id, uid } = item
    return {
      id,
      uid,
      subject,
      unseen,
      messageId,
      date,
      from,
      to,
      // ui need state
      isChoose: false,
      avatarBadgeType,
      itemType: ItemType.None,
    }
  })

export const InboxComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const api = useAPI()
  const router = useRouter()

  const [newPageIndex, setNewPageIndex] = useState(0)
  const [newMessages, setNewMessages] = useState<Array<MessageItem>>([])
  const [surplus, setSurplus] = useState(0)

  const [seenMessages, setSeenMessages] = useState<Array<MessageItem>>([])
  const [seenIsFetching, setSeenIsFetching] = useState(true)

  const [isChooseMode, setIsChooseMode] = useState(false)
  const [chooseMap, setChooseMap] = useState<Record<string, boolean>>({})
  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>({})

  const refSeenBoxList = useRef<InfiniteHandle>(null)

  useQuery(
    ['getNewMessages', 0],
    async () => {
      const { data } = await api.getMessagesNew(0)
      return data
    },
    {
      refetchInterval: 30000,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        if (d.messages.length) {
          // TODO will be have bug when new mail to exceed page size
          // so, should be request alone api to get all new mails
          const newItem = d.messages.filter((i) =>
            newMessages.every((i2: { id: any }) => i2.id !== i.id)
          )
          if (!newItem.length) return
          // TODO
          // BUG unshift not work
          const newDate = formatState(newItem, AvatarBadgeType.New)
          const newState = [...newDate, ...newMessages]
          // console.log('newDate', newDate)
          // console.log('newState', newState)
          setSurplus(d.total - newState.length)
          setNewMessages(newState)
        }
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
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        if (d.messages.length) {
          const newItem = d.messages.filter((i) =>
            newMessages.every((i2: { id: any }) => i2.id !== i.id)
          )
          const newDate = formatState(newItem, AvatarBadgeType.New)
          const newState = [...newMessages, ...newDate]

          setSurplus(d.total - newState.length)
          setNewMessages(newState)
        }
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

  const isLoading = newIsFetching && seenIsFetching
  const seenIsHidden = seenIsFetching || !seenMessages.length
  const isClear = !isLoading && !newMessages.length && !seenMessages.length
  const isNoNew = !isLoading && !newMessages.length && !!seenMessages.length

  return (
    <NewPageContainer>
      <SlideFade in={isChooseMode} offsetY="-20px">
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
      </SlideFade>

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
          <Box padding={{ md: '30px 64px', base: '20px' }}>
            <Box className="title">{t('inbox.title.new')}</Box>
            {isClear && <EmptyStatus />}
            {isLoading && <Loading />}
            {isNoNew && <NoNewStatus />}
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
            padding={{ base: '20px', md: '20px 64px' }}
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
