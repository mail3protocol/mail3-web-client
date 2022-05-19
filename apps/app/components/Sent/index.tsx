/* eslint-disable @typescript-eslint/no-use-before-define */
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { useDidMount } from 'hooks'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { AvatarBadgeType, BoxList, ItemType } from '../BoxList'
import { RoutePath } from '../../route/path'
import { Mailboxes } from '../../api/mailboxes'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { useAPI } from '../../hooks/useAPI'
import SVGBottom from '../../assets/is-bottom.svg'

const TitleBox = styled(Box)`
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
`

export const SentComponent: React.FC = () => {
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
    const { data } = await api.getMailboxesMessages(Mailboxes.Sent, _pageIndex)

    if (data?.messages?.length) {
      const newDate = [...messages, ...data.messages]
      setMessages(newDate)
      setIsFetching(false)
      setPageIndex(_pageIndex)
    } else {
      setHasNext(false)
    }
  }

  return (
    <Box>
      <Box
        margin="25px auto"
        bgColor="#FFFFFF"
        boxShadow="0px 0px 10px 4px rgba(25, 25, 100, 0.1)"
        borderRadius="24px"
      >
        <Box>
          <Box padding="20px 64px">
            <TitleBox>Sent</TitleBox>
            <BoxList
              data={messages}
              onBodyClick={(id) => {
                router.push(`${RoutePath.Message}/${id}`)
              }}
            />

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
                <SVGBottom />
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
