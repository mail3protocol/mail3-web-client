import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Box, Center, Circle, Flex, Spinner } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import styled from '@emotion/styled'
import { useInfiniteQuery } from 'react-query'
import { useRouter } from 'next/router'
import { Button, PageContainer } from 'ui'
import { useToast } from 'hooks'
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

export const NewPageContainer = styled(PageContainer)`
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

export const InboxComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const api = useAPI()
  const router = useRouter()
  const toast = useToast()

  const [seenMessages, setSeenMessages] = useState<messagesState>(null)
  const [isLoadingSeen, setIsLoadingSeen] = useState(true)

  const [isChooseMode, setIsChooseMode] = useState(false)
  const [chooseMap, setChooseMap] = useState<Record<string, boolean>>({})
  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>({})

  const refSeenBoxList = useRef<InfiniteHandle>(null)

  const queryFnNews = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getMessagesNew(pageParam)
      return data
    },
    [api]
  )

  const {
    data: newsInfiniteData,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingNews,
    isFetchingNextPage,
  } = useInfiniteQuery('newsQuery', queryFnNews, {
    getNextPageParam: (lastPage) => {
      if (typeof lastPage?.page !== 'number') return undefined
      if (lastPage.page >= lastPage.pages - 1) {
        return undefined
      }
      return lastPage.page + 1
    },
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: 5000,
  })

  const newMessages = useMemo(() => {
    if (!newsInfiniteData) return null
    const dataList = newsInfiniteData.pages.map((item) => item.messages)
    return formatState(dataList.flat(), AvatarBadgeType.New)
  }, [newsInfiniteData])

  const newsTotal = useMemo(() => {
    if (newsInfiniteData?.pages?.length)
      return newsInfiniteData.pages[newsInfiniteData.pages.length - 1].total
    return 0
  }, [newsInfiniteData])

  const queryFnSeen = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getMessagesSeen(pageParam)
      return data
    },
    [api]
  )

  const isLoading = isLoadingNews || isLoadingSeen
  const isNewsEmpty = !isLoading && !newMessages?.length
  const isNewsNoEmpty = !isLoading && newMessages?.length
  const isSeenEmpty = isLoading || !seenMessages?.length
  const isClear = !isLoading && isNewsEmpty && isSeenEmpty

  return (
    <NewPageContainer>
      {isChooseMode && (
        <MailboxMenu
          type={MailboxMenuType.Base}
          actionMap={{
            [BulkActionType.Delete]: async () => {
              const newIds =
                Object.keys(chooseMap).filter((key) => chooseMap[key]) ?? []
              const seenIds = refSeenBoxList?.current?.getChooseIds() ?? []
              const ids = [...newIds, ...seenIds]

              if (!ids.length) return
              try {
                await api.batchDeleteMessage(ids)
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
                toast(t('status.trash.ok'))
              } catch (error) {
                toast(t('status.trash.fail'))
              }
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
            {isLoading && <Loading />}
            {isClear ? <EmptyStatus /> : isNewsEmpty && <NoNewStatus />}
            {isNewsNoEmpty && (
              <>
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
                  getHref={(id) => `${RoutePath.Message}/${id}`}
                  onClickBody={() => {
                    // report point
                  }}
                />
                {hasNextPage && (
                  <Center>
                    <Button
                      isLoading={isFetchingNextPage}
                      variant="outline"
                      onClick={() => {
                        fetchNextPage()
                      }}
                    >
                      {t('inbox.load-more')} +{PAGE_SIZE}
                    </Button>
                    <Circle
                      size="40px"
                      bg="black"
                      color="white"
                      marginLeft="10px"
                    >
                      {newMessages?.length ? newsTotal - newMessages.length : 0}
                    </Circle>
                  </Center>
                )}
              </>
            )}
          </Box>

          <Box
            padding={{ base: 0, md: '20px 64px' }}
            bg="rgba(243, 243, 243, 0.4);"
            display={isSeenEmpty ? 'none' : 'block'}
          >
            <Box className="title">{t('inbox.title.seen')}</Box>
            <InfiniteMailbox
              ref={refSeenBoxList}
              enableQuery
              queryFn={queryFnSeen}
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
              onGetIsLoading={(b) => {
                setIsLoadingSeen(b)
              }}
              onChooseModeChange={(b) => {
                setIsChooseMode(b)
              }}
              parentIsChooseMode={isChooseMode}
              parentChooseMap={chooseMap}
              onClickBody={() => {
                // report point
              }}
              getHref={(id) => `${RoutePath.Message}/${id}`}
            />
          </Box>
        </MailboxContainer>
      </Box>
    </NewPageContainer>
  )
}
