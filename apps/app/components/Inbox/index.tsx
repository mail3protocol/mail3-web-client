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
import {
  BoxList,
  AvatarBadgeType,
  ItemType,
  isChooseModeAtom,
} from '../BoxList'
import { InboxNav } from './Nav'
import { Navbar } from '../Navbar'
import { Subscription } from './Subscription'
import {
  StickyButtonBox,
  SuspendButton,
  SuspendButtonType,
} from '../SuspendButton'
import { useAPI } from '../../hooks/useAPI'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

import SVGWrite from '../../assets/icon-write.svg'

const mockItem = {
  avatar: '',
  id: 123,
  emailId: 123,
  messageId: 123,
  unseen: true,
  date: '2022-02-01 / 12:01 am',
  subject: 'subject subject subject',
  desc: 'The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications. The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications.',
}

const mockList = {
  new: {
    total: 100,
    page: 1,
    size: 20,
  },
  seen: {
    total: 100,
    page: 1,
    size: 20,
  },
  total: 100,
  page: 1,
  size: 20,
  seenMessages: [
    {
      avatar: '',
      id: 123,
      emailId: 123,
      messageId: 123,
      unseen: false,
      date: '2022-02-01 / 12:01 am',
      subject: 'subject subject subject',
      desc: 'The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications. The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications.',

      // other state props
      isChoose: false,
      avatarBadgeType: AvatarBadgeType.None,
    },
    {
      avatar: '',
      id: 123,
      emailId: 123,
      messageId: 123,
      unseen: false,
      date: '2022-02-01 / 12:01 am',
      subject: 'subject subject subject',
      desc: 'The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications. The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications.',

      // other state props
      isChoose: false,
      avatarBadgeType: AvatarBadgeType.SentOK,
      itemType: ItemType.None,
    },
    {
      avatar: '',
      id: 123,
      emailId: 123,
      messageId: 123,
      unseen: false,
      date: '2022-02-01 / 12:01 am',
      subject: 'subject subject subject',
      desc: 'The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications. The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications.',

      // other state props
      isChoose: false,
      avatarBadgeType: AvatarBadgeType.SentFail,
      itemType: ItemType.Fail,
    },
  ],
  newMessages: [
    {
      avatar: '',
      id: 123,
      emailId: 123,
      messageId: 123,
      unseen: true,
      date: '2022-02-01 / 12:01 am',
      subject: 'subject subject subject',
      desc: 'The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications. The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications.',

      // other state props
      isChoose: false,
      avatarBadgeType: AvatarBadgeType.New,
    },
  ],
}

mockList.newMessages = [...mockList.newMessages, ...mockList.newMessages]
mockList.newMessages = [...mockList.newMessages, ...mockList.newMessages]

mockList.seenMessages = [...mockList.seenMessages, ...mockList.seenMessages]
mockList.seenMessages = [...mockList.seenMessages, ...mockList.seenMessages]

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

const formatState = (data: any, avatarBadgeType) => {
  if (!data.length) return []

  const newData = data.map((item: any) => {
    const { subject, unseen, messageId, date, from, to, id, uid, text } = item
    return {
      id,
      uid,
      subject,
      unseen,
      messageId,
      date,
      from,
      to,
      text,
      avatar: '',
      // ui need state
      isChoose: false,
      avatarBadgeType,
      itemType: ItemType.None,
    }
  })

  return newData
}

export const InboxComponent: React.FC = () => {
  const [t] = useTranslation('inbox')
  const [pageType] = useAtom(pageTypeAtom)
  const api = useAPI()

  const [newPageIndex, setNewPageIndex] = useState(0)
  const [newMessages, setNewMessages] = useState<any>([])

  const [pageIndexSeen, setPageIndexSeen] = useState(0)
  const [seenMessages, setSeenMessages] = useState<any>([])
  const [seenHasNext, setSeenHasNext] = useState(true)

  const [isChooseMode, setIsChooseMode] = useAtom(isChooseModeAtom)

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
          const newState = formatState(newItem, AvatarBadgeType.None)
          const newDate: any = update(newMessages, {
            $unshift: newState,
          })

          setNewMessages(newDate)
        }
      },
    }
  )

  useDidMount(async () => {
    // console.log('InboxComponent useDidMount')
    // setNewMessages(mockList.newMessages)
    // setSeenMessages(mockList.seenMessages)

    fetchDateSeen(0)
  })

  useEffect(() => {
    console.log('pageType:', pageType)
  }, [pageType])

  const newLoadMore = () => {
    console.log('newPageIndex', newPageIndex)
    const index = newPageIndex + 1
    // page + 1, get new date
    const newDate: any = update(newMessages, {
      $push: [mockItem, mockItem, mockItem, mockItem, mockItem, mockItem],
    })

    setNewPageIndex(index)
    setNewMessages(newDate)
  }

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

  const updateItem = (type: string) => (index: number) => {
    console.log('update item index', index)

    const oldDate = type === 'seen' ? seenMessages : newMessages

    const newDate: any = update(oldDate, {
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
                  console.log('write')
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
            >
              {pageType === PageType.Inbox && (
                <Box>
                  <Box padding="30px 64px">
                    <TitleBox>New</TitleBox>
                    <BoxList data={newMessages} update={updateItem('new')} />
                    {newPageIndex < 10 && (
                      <Center>
                        <Button
                          variant="outline"
                          onClick={() => {
                            newLoadMore()
                          }}
                        >
                          load more +10
                        </Button>
                        <Circle
                          size="40px"
                          bg="black"
                          color="white"
                          marginLeft="10px"
                        >
                          100
                        </Circle>
                      </Center>
                    )}
                  </Box>

                  <Box padding="20px 64px" bg="rgba(243, 243, 243, 0.4);">
                    <TitleBox>Seem</TitleBox>
                    <BoxList data={seenMessages} update={updateItem('seen')} />
                  </Box>
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
