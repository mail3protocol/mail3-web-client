/* eslint-disable @typescript-eslint/no-use-before-define */
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { Box, Center, Circle, Flex } from '@chakra-ui/react'
import { atom, useAtom } from 'jotai'
import { useDidMount } from 'hooks'
import { Button } from 'ui'
import styled from '@emotion/styled'
import update from 'immutability-helper'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { BoxList, AvatarBadgeType, ItemType, MessageItem } from '../BoxList'
import { InboxNav } from './Nav'
import { Navbar } from '../Navbar'
import { Subscription } from './Subscription'
import { StickyButtonBox, SuspendButtonType } from '../SuspendButton'
import { useAPI } from '../../hooks/useAPI'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

import SVGWrite from '../../assets/icon-write.svg'
import { RoutePath } from '../../route/path'
import IMGClear from '../../assets/clear.png'
import IMGNewNone from '../../assets/new-none.png'
import { MessageItemResponse } from '../../api'

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
  const [t] = useTranslation('inbox')
  const [pageType] = useAtom(pageTypeAtom)
  const api = useAPI()
  const router = useRouter()

  const [newPageIndex, setNewPageIndex] = useState(0)
  const [newMessages, setNewMessages] = useState<Array<MessageItem>>([])
  const [surplus, setSurplus] = useState(0)

  const [pageIndexSeen, setPageIndexSeen] = useState(0)
  const [seenMessages, setSeenMessages] = useState<Array<MessageItem>>([])
  const [seenHasNext, setSeenHasNext] = useState(true)

  const [isChooseMode, setIsChooseMode] = useState(false)

  const [, setIsFetching] = useInfiniteScroll(fetchDateSeen)

  useQuery(
    ['getNewMessages', 0],
    async () => {
      const { data } = await api.getMessagesNew(0)
      return data
    },
    {
      refetchInterval: 1000,
      onSuccess(d) {
        if (d.messages.length) {
          const newItem = d.messages.filter((i) =>
            newMessages.every((i2: { id: any }) => i2.id !== i.id)
          )
          // console.log('newItem', newItem)

          if (!newItem.length) return
          // TODO
          // BUG unshift not work
          const newState = formatState(newItem, AvatarBadgeType.New)
          const newDate: any = update(newMessages, {
            $unshift: newState,
          })
          // console.log('newDate', newDate)

          setSurplus(d.total - newDate.length)
          setNewMessages(newDate)
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
          const newState = formatState(newItem, AvatarBadgeType.New)
          const newDate: any = update(newMessages, {
            $push: newState,
          })

          setSurplus(d.total - newDate.length)
          setNewMessages(newDate)
        }
      },
    }
  )

  useDidMount(async () => {
    fetchDateSeen(0)
  })

  useEffect(() => {
    console.log('pageType:', pageType)
  }, [pageType])

  async function fetchDateSeen(page: number | undefined) {
    if (!seenHasNext) return

    const pageIndex = page === undefined ? pageIndexSeen + 1 : 0
    setIsFetching(true)
    const { data } = await api.getMessagesSeen(pageIndex)

    if (data?.messages?.length) {
      const newState = formatState(data.messages, AvatarBadgeType.None)
      const newDate: any = update(seenMessages, {
        $push: newState,
      })

      setSeenMessages(newDate)
      setIsFetching(false)
      setPageIndexSeen(pageIndex)
    } else {
      setSeenHasNext(false)
    }
  }

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
    const oldDate: any = type === 'seen' ? seenMessages : newMessages

    const newDate = update(oldDate, {
      [index]: {
        isChoose: {
          $set: !oldDate[index].isChoose,
        },
      },
    })

    if (newDate.every((item: { isChoose: boolean }) => !item.isChoose)) {
      setIsChooseMode(false)
    }

    if (type === 'seen') {
      setSeenMessages(newDate)
    } else {
      setNewMessages(newDate)
    }
  }

  const isClear = !newMessages.length && !seenMessages.length
  const isNoNew = !newMessages.length && seenMessages.length

  return (
    <Box>
      <Navbar />
      {isChooseMode && (
        <StickyButtonBox
          list={[
            {
              type: SuspendButtonType.Delete,
              onClick: () => {
                console.log('del')
              },
            },
          ]}
        />
      )}
      <Center>
        <Box w="1280px">
          <Box paddingTop="60px">
            <Flex justifyContent="space-between">
              <InboxNav />
              <Button
                onClick={() => {
                  router.push(RoutePath.NewMessage)
                }}
              >
                <SVGWrite /> <Box ml="10px">Write</Box>
              </Button>
            </Flex>

            <Box
              margin="25px auto"
              bgColor="#FFFFFF"
              boxShadow="0px 0px 10px 4px rgba(25, 25, 100, 0.1)"
              borderRadius="24px"
              minH="700px"
            >
              {pageType === PageType.Inbox && (
                <Box>
                  <Box padding="30px 64px">
                    <TitleBox>New</TitleBox>
                    {isClear && (
                      <Flex
                        h="500px"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Box>
                          <Box
                            fontSize="20px"
                            fontWeight={500}
                            lineHeight="30px"
                            marginBottom="30px"
                          >
                            You’re all clear
                          </Box>
                          <Image src={IMGClear} />
                        </Box>
                      </Flex>
                    )}

                    {isNoNew && (
                      <Flex
                        h="300px"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Box>
                          <Box
                            fontSize="20px"
                            fontWeight={500}
                            lineHeight="30px"
                            marginBottom="30px"
                          >
                            Nothing New！
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
                          load more +{PAGE_SIZE}
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

                  {!!seenMessages.length && (
                    <Box padding="20px 64px" bg="rgba(243, 243, 243, 0.4);">
                      <TitleBox>Seen</TitleBox>
                      <BoxList
                        data={seenMessages}
                        isChooseMode={isChooseMode}
                        setIsChooseMode={setIsChooseMode}
                        onClickAvatar={updateItem('seen')}
                        onClickBody={(id) => {
                          router.push(`${RoutePath.Message}/${id}`)
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}

              {pageType === PageType.Subscrption && (
                <Box>
                  <Box padding="40px 64px">
                    <Subscription />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Center>
    </Box>
  )
}
