/* eslint-disable @typescript-eslint/no-use-before-define */
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { Box, Flex, Spacer, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { useDidMount } from 'hooks'
import { Button } from 'ui'
import styled from '@emotion/styled'
import update from 'immutability-helper'
import { useRouter } from 'next/router'
import { BoxList } from '../BoxList'
import SVGTrash from '../../assets/trash.svg'
import SVGIconEmpty from '../../assets/icon-empty.svg'
import { useAPI } from '../../hooks/useAPI'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { Mailboxes } from '../../api/mailboxes'
import { RoutePath } from '../../route/path'
import SVGNone from '../../assets/none.svg'
import SVGIsBottom from '../../assets/is-bottom.svg'

export const TrashComponent: React.FC = () => {
  const [t] = useTranslation('inbox')
  const [messages, setMessages] = useState<any>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [hasNext, setHasNext] = useState(true)
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
    const { data } = await api.getMailboxesMessages(Mailboxes.Trash, _pageIndex)

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

  const TextBox = styled(Box)`
    margin-top: 10px;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
  `

  return (
    <>
      <Flex alignItems="center">
        <Wrap>
          <WrapItem alignItems="center">
            <SVGTrash />
          </WrapItem>
          <WrapItem
            alignItems="center"
            fontStyle="normal"
            fontWeight="700"
            fontSize="24px"
            lineHeight="30px"
          >
            Trash
          </WrapItem>
        </Wrap>

        <Spacer />
        <Button
          onClick={() => {
            console.log('empty')
          }}
        >
          <SVGIconEmpty />
          <Box marginLeft="10px">Empty</Box>
        </Button>
      </Flex>
      <Box
        margin="25px auto"
        bgColor="#FFFFFF"
        boxShadow="0px 0px 10px 4px rgba(25, 25, 100, 0.1)"
        borderRadius="24px"
        minH="500px"
      >
        <Box>
          <Box padding="20px 64px">
            <TextBox>
              <Text>
                Messages that have been in Trash more than 30 days will be
                automatically deleted.
              </Text>
            </TextBox>
            <BoxList
              data={messages}
              onBodyClick={(id) => {
                router.push(`${RoutePath.Message}/${id}`)
              }}
            />
            {messages.length && (
              <Flex h="200px" justifyContent="center" alignItems="center">
                <Box>
                  <Box
                    fontSize="12px"
                    fontWeight={400}
                    lineHeight="18px"
                    marginBottom="20px"
                    textAlign="center"
                  >
                    This is bottom！
                  </Box>
                  <SVGIsBottom />
                </Box>
              </Flex>
            )}
            {!messages.length && (
              <Flex h="200px" justifyContent="center" alignItems="center">
                <Box>
                  <Box
                    fontSize="16px"
                    fontWeight={400}
                    lineHeight="18px"
                    marginBottom="20px"
                    textAlign="center"
                  >
                    Clean Trash!
                  </Box>
                  <SVGNone />
                </Box>
              </Flex>
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}
