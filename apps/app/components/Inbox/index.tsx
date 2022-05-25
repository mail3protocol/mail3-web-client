/* eslint-disable @typescript-eslint/no-use-before-define */
import { useTranslation } from 'next-i18next'
import React, { useCallback, useRef, useState } from 'react'
import { Box, Center, Circle, Flex } from '@chakra-ui/react'
import { atom, useAtom } from 'jotai'
import { Button } from 'ui'
import styled from '@emotion/styled'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import Image from 'next/image'
import {
  BoxList,
  AvatarBadgeType,
  ItemType,
  MessageItem,
  InfiniteHandle,
  InfiniteList,
} from '../BoxList'
import { InboxNav } from './Nav'
import { Subscription } from './Subscription'
import { StickyButtonBox, SuspendButtonType } from '../SuspendButton'
import { useAPI } from '../../hooks/useAPI'
import { MessageItemResponse } from '../../api'
import { RoutePath } from '../../route/path'

import SVGWrite from '../../assets/icon-write.svg'
import IMGClear from '../../assets/clear.png'
import IMGNewNone from '../../assets/new-none.png'

const PAGE_SIZE = 20

export enum PageType {
  Inbox,
  Subscrption,
}

export const pageTypeAtom = atom<PageType>(PageType.Inbox)

const TitleBox = styled(Box)`
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
`

export const MailboxContainer = styled(Box)`
  margin: 20px auto;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 24px;

  @media (max-width: 600px) {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: none;
  }
`
const FlexButtonBox = styled(Flex)`
  justify-content: space-between;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    justify-content: normal;
    align-items: center;
  }
`
const ButtonWrite = styled(Button)`
  @media (max-width: 600px) {
    margin-bottom: 20px;
    margin-right: 20px;
    align-self: flex-end;
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
  const [pageType] = useAtom(pageTypeAtom)
  const api = useAPI()
  const router = useRouter()

  const [newPageIndex, setNewPageIndex] = useState(0)
  const [newMessages, setNewMessages] = useState<Array<MessageItem>>([])
  const [surplus, setSurplus] = useState(0)

  const [seenMessages, setSeenMessages] = useState<Array<MessageItem>>([])
  const [seenIsEmpty, setSeenIsEmpty] = useState(true)

  const [isChooseMode, setIsChooseMode] = useState(false)

  const refSeenBoxList = useRef<InfiniteHandle>(null)

  useQuery(
    ['getNewMessages', 0],
    async () => {
      const { data } = await api.getMessagesNew(0)
      return data
    },
    {
      refetchInterval: 30000,
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
          console.log('newDate', newDate)
          console.log('newState', newState)
          setSurplus(d.total - newState.length)
          setNewMessages(newState)
        }
      },
    }
  )

  useQuery(
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

  // useEffect(() => {
  //   console.log('pageType:', pageType)
  // }, [pageType])

  const queryFn = useCallback(async ({ pageParam = 0 }) => {
    const { data } = await api.getMessagesSeen(pageParam)
    return data
  }, [])

  const onDataChange = useCallback((data) => {
    if (data.length) {
      setSeenIsEmpty(false)
    } else {
      setSeenIsEmpty(true)
    }
    setSeenMessages(data)
  }, [])

  const onChooseModeChange = useCallback((bool) => {
    setIsChooseMode(bool)
  }, [])

  const getChooseList = useCallback(() => {
    const ids = refSeenBoxList?.current?.getChooseIds()
    return ids
  }, [])

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

  const updateItem = (type: string) => (index: number) => {
    let newDate
    if (type === 'seen') {
      newDate = [...seenMessages]
      newDate[index].isChoose = !newDate[index].isChoose
      setSeenMessages(newDate)
    } else {
      newDate = [...newMessages]
      newDate[index].isChoose = !newDate[index].isChoose
      setNewMessages(newDate)
    }

    if (newDate.every((item) => !item.isChoose)) {
      setIsChooseMode(false)
    }
  }

  const isClear = !newMessages.length && !seenMessages.length
  const isNoNew = !newMessages.length && !!seenMessages.length

  return (
    <Box>
      {isChooseMode && (
        <StickyButtonBox
          list={[
            {
              type: SuspendButtonType.Delete,
              onClick: () => {
                const ids = getChooseList()
                console.log('del', ids)
              },
            },
          ]}
        />
      )}

      <Box paddingTop={{ base: '25px', md: '35px' }}>
        <FlexButtonBox>
          <InboxNav />
          <ButtonWrite
            onClick={() => {
              router.push(RoutePath.NewMessage)
            }}
          >
            <SVGWrite /> <Box ml="10px">Write</Box>
          </ButtonWrite>
        </FlexButtonBox>

        <MailboxContainer minH="700px">
          {pageType === PageType.Inbox && (
            <>
              <Box padding={{ md: '30px 64px', base: '20px' }}>
                <TitleBox>{t('inbox.title.new')}</TitleBox>
                {isClear && (
                  <Flex h="500px" justifyContent="center" alignItems="center">
                    <Box>
                      <Box
                        fontSize="20px"
                        fontWeight={500}
                        lineHeight="30px"
                        marginBottom="30px"
                      >
                        {t('inbox.all-clear')}
                      </Box>
                      <Image src={IMGClear} />
                    </Box>
                  </Flex>
                )}

                {isNoNew && (
                  <Flex h="300px" justifyContent="center" alignItems="center">
                    <Box>
                      <Box
                        fontSize="20px"
                        fontWeight={500}
                        lineHeight="30px"
                        marginBottom="30px"
                      >
                        {t('inbox.no-new')}
                      </Box>
                      <Image src={IMGNewNone} />
                    </Box>
                  </Flex>
                )}
                <BoxList
                  data={newMessages}
                  isChooseMode={isChooseMode}
                  setIsChooseMode={setIsChooseMode}
                  onClickAvatar={updateItem('new')}
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
                    <Circle
                      size="40px"
                      bg="black"
                      color="white"
                      marginLeft="10px"
                    >
                      {surplus}
                    </Circle>
                  </Center>
                )}
              </Box>

              <Box
                padding={{ base: '20px', md: '20px 64px' }}
                bg="rgba(243, 243, 243, 0.4);"
                display={seenIsEmpty ? 'none' : 'block'}
              >
                <TitleBox>{t('inbox.title.seen')}</TitleBox>
                <InfiniteList
                  ref={refSeenBoxList}
                  enableQuery
                  queryFn={queryFn}
                  queryKey={['Seen']}
                  emptyElement=""
                  noMoreElement=""
                  onDataChange={onDataChange}
                  onChooseModeChange={onChooseModeChange}
                  // onQueryStatusChange={onQueryStatusChange}
                  onClickBody={(id: string) => {
                    router.push(`${RoutePath.Message}/${id}`)
                  }}
                />
              </Box>
            </>
          )}

          {pageType === PageType.Subscrption && (
            <Box padding="40px 64px">
              <Subscription />
            </Box>
          )}
        </MailboxContainer>
      </Box>
    </Box>
  )
}
