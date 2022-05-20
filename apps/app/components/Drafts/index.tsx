/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useDidMount } from 'hooks'
import { useRouter } from 'next/router'
import { Box, Flex, Wrap, WrapItem } from '@chakra-ui/react'
import { useAPI } from '../../hooks/useAPI'
import { AvatarBadgeType, BoxList, MessageItem } from '../BoxList'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { StickyButtonBox, SuspendButtonType } from '../SuspendButton'
import { RoutePath } from '../../route/path'
import { Mailboxes } from '../../api/mailboxes'
import { formatState, MailboxContainer } from '../Inbox'

import SVGDrafts from '../../assets/drafts.svg'
import SVGNone from '../../assets/none.svg'

export const DraftsComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [hasNext, setHasNext] = useState(true)
  const [isChooseMode, setIsChooseMode] = useState(false)
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
      const newDate = [
        ...messages,
        ...formatState(data.messages, AvatarBadgeType.None),
      ]
      setMessages(newDate)
      setIsFetching(false)
      setPageIndex(_pageIndex)
    } else {
      setHasNext(false)
    }
  }

  const onUpdate = (index: number) => {
    const newDate = [...messages]
    newDate[index].isChoose = !newDate[index].isChoose
    setMessages(newDate)
    if (newDate.every((item) => !item.isChoose)) {
      setIsChooseMode(false)
    }
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
      <Flex alignItems="center" paddingTop="30px">
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
            {t('drafts.title')}
          </WrapItem>
        </Wrap>
      </Flex>
      <MailboxContainer>
        <Box padding={{ md: '20px 64px', sm: '10px' }}>
          <BoxList
            data={messages}
            isChooseMode={isChooseMode}
            setIsChooseMode={setIsChooseMode}
            onClickAvatar={onUpdate}
            onClickBody={(id) => {
              router.push(`${RoutePath.Message}/${id}`)
            }}
          />

          {!messages.length && (
            <Flex
              h="400px"
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
                <p>{t('drafts.no-content-w1')}</p>
                <p>{t('drafts.no-content-w2')}</p>
                <p>{t('drafts.no-content-w3')}</p>
              </Box>
              <SVGNone />
            </Flex>
          )}
        </Box>
      </MailboxContainer>
    </>
  )
}
