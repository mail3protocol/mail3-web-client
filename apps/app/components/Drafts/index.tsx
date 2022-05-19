/* eslint-disable @typescript-eslint/no-use-before-define */
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { Box, Flex, Wrap, WrapItem } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useDidMount } from 'hooks'
import update from 'immutability-helper'
import { useRouter } from 'next/router'
import { BoxList, isChooseModeAtom } from '../BoxList'
import { useAPI } from '../../hooks/useAPI'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { StickyButtonBox, SuspendButtonType } from '../SuspendButton'
import { RoutePath } from '../../route/path'
import { Mailboxes } from '../../api/mailboxes'
import SVGDrafts from '../../assets/drafts.svg'
import SVGNone from '../../assets/none.svg'

export const DraftsComponent: React.FC = () => {
  const [t] = useTranslation('inbox')
  const [messages, setMessages] = useState<any>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [hasNext, setHasNext] = useState(true)
  const [isChooseMode, setIsChooseMode] = useAtom(isChooseModeAtom)
  const router = useRouter()
  const api = useAPI()
  const [, setIsFetching] = useInfiniteScroll(fetchDate)

  useDidMount(() => {
    fetchDate(0)
  })

  async function fetchDate(page: number | undefined) {
    if (!hasNext) return

    const _pageIndex = page === undefined ? pageIndex + 1 : 0
    setIsFetching(true)
    const { data } = await api.getMailboxesMessages(
      Mailboxes.Drafts,
      _pageIndex
    )

    if (data?.messages?.length) {
      const newDate: any = update(messages, {
        $push: data.messages,
      })
      setMessages(newDate)
      setIsFetching(false)
      setPageIndex(_pageIndex)
    } else {
      setHasNext(false)
    }
  }

  const updateItem = (index: number) => {
    console.log('update item index', index)

    const newDate: any = update(messages, {
      [index]: {
        isChoose: {
          $set: !messages[index].isChoose,
        },
      },
    })

    if (newDate.every((item: { isChoose: boolean }) => !item.isChoose)) {
      setIsChooseMode(false)
    }

    setMessages(newDate)
  }

  return (
    <>
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
      <Flex alignItems="center">
        <Wrap>
          <WrapItem alignItems="center">
            <SVGDrafts />
          </WrapItem>
          <WrapItem
            alignItems="center"
            fontStyle="normal"
            fontWeight="700"
            fontSize="24px"
            lineHeight="30px"
          >
            Drafts
          </WrapItem>
        </Wrap>
      </Flex>
      <Box
        margin="25px auto"
        bgColor="#FFFFFF"
        boxShadow="0px 0px 10px 4px rgba(25, 25, 100, 0.1)"
        borderRadius="24px"
      >
        <Box>
          <Box padding="20px 64px">
            <BoxList
              data={messages}
              update={updateItem}
              onBodyClick={(id) => {
                router.push(`${RoutePath.Message}/${id}`)
              }}
            />

            {!messages.length && (
              <Flex
                h="200px"
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                <Box
                  fontSize="16px"
                  fontWeight={500}
                  lineHeight="24px"
                  marginBottom="20px"
                  textAlign="center"
                >
                  <p>Any time you start writing a new Email, </p>
                  <p>
                    Mail3 will automatically save it as a draft along the way.
                  </p>
                  <p>Come here to find all your works in progress.</p>
                </Box>
                <SVGNone />
              </Flex>
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}
