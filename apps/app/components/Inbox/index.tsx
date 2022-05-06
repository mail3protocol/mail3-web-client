import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { Box, Center, Circle } from '@chakra-ui/react'
import { atom, useAtom } from 'jotai'
import { useDidMount } from 'hooks'
import { Button } from 'ui'
import update from 'immutability-helper'
import { BoxList } from '../BoxList'
import { InboxNav } from './Nav'
import { Navbar } from '../Navbar'
import { Subscription } from './Subscription'

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
      unseen: true,
      date: '2022-02-01 / 12:01 am',
      subject: 'subject subject subject',
      desc: 'The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications. The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications.',
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
    },
  ],
}

mockList.newMessages = [...mockList.newMessages, ...mockList.newMessages]
mockList.newMessages = [...mockList.newMessages, ...mockList.newMessages]

mockList.seenMessages = [...mockList.seenMessages, ...mockList.seenMessages]
mockList.seenMessages = [...mockList.seenMessages, ...mockList.seenMessages]

export enum PageType {
  Inbox,
  Subscrption,
}

export const pageTypeAtom = atom<PageType>(PageType.Inbox)

export const InboxComponent: React.FC = () => {
  const [t] = useTranslation('inbox')
  const [newPageIndex, setNewPageIndex] = useState(1)
  const [seenPageIndex, setSeenPageIndex] = useState(1)
  const [newMessages, setNewMessages] = useState<any>([])
  const [seenMessages, setSeenMessages] = useState<any>([])
  const [pageType] = useAtom(pageTypeAtom)

  useDidMount(() => {
    console.log('InboxComponent useDidMount')
    setNewMessages(mockList.newMessages)
    setSeenMessages(mockList.seenMessages)
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

  const seenLoadMore = () => {
    console.log('seenPageIndex', seenPageIndex)
    const index = seenPageIndex + 1
    // page + 1, get new date
    const newDate: any = update(seenMessages, {
      $push: [mockItem, mockItem, mockItem, mockItem, mockItem, mockItem],
    })

    setSeenPageIndex(index)
    setSeenMessages(newDate)
  }

  const updateItem = (type) => (index) => {
    console.log('update item index', index)

    const newDate: any = update(type === 'seen' ? seenMessages : newMessages, {
      [index]: {
        isChoose: {
          $set: true,
        },
      },
    })

    if (type === 'seen') {
      setSeenMessages(newDate)
    } else {
      setNewMessages(newDate)
    }
  }

  return (
    <Box>
      <Navbar />
      <Center>
        <Box w="1280px">
          <Box paddingTop="60px">
            <InboxNav />
            <Box
              margin="25px auto"
              bgColor="#FFFFFF"
              boxShadow="0px 0px 10px 4px rgba(25, 25, 100, 0.1)"
              borderRadius="24px"
            >
              {pageType === PageType.Inbox && (
                <Box>
                  <Box padding="20px 64px">
                    <Box>NEW</Box>
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
                    <Box>SEEM</Box>
                    <BoxList data={seenMessages} />
                    {seenPageIndex < 10 && (
                      <Center>
                        <Button
                          variant="outline"
                          onClick={() => {
                            seenLoadMore()
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
