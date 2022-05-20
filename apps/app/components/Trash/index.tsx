/* eslint-disable @typescript-eslint/no-use-before-define */
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { Box, Flex, Spacer, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { useDidMount } from 'hooks'
import { Button } from 'ui'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { AvatarBadgeType, BoxList, MessageItem } from '../BoxList'
import SVGTrash from '../../assets/trash.svg'
import SVGIconEmpty from '../../assets/icon-empty.svg'
import { useAPI } from '../../hooks/useAPI'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { Mailboxes } from '../../api/mailboxes'
import { RoutePath } from '../../route/path'
import SVGNone from '../../assets/none.svg'
import SVGIsBottom from '../../assets/is-bottom.svg'
import { formatState, MailboxContainer } from '../Inbox'

export const TrashComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const [messages, setMessages] = useState<MessageItem[]>([])
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

  const TextBox = styled(Box)`
    margin-top: 10px;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
  `

  return (
    <>
      <Flex alignItems="center" paddingTop="30px">
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
            {t('trash.title')}
          </WrapItem>
        </Wrap>

        <Spacer />
        <Button
          onClick={() => {
            console.log('empty')
          }}
        >
          <SVGIconEmpty />
          <Box marginLeft="10px">{t('trash.empty')}</Box>
        </Button>
      </Flex>
      <MailboxContainer>
        <Box padding={{ md: '20px 64px' }}>
          <TextBox>
            <Text>{t('trash.auto-delete')}</Text>
          </TextBox>
          <BoxList
            data={messages}
            onClickBody={(id) => {
              router.push(`${RoutePath.Message}/${id}`)
            }}
          />
          {!!messages.length && (
            <Flex h="200px" justifyContent="center" alignItems="center">
              <Box>
                <Box
                  fontSize="12px"
                  fontWeight={400}
                  lineHeight="18px"
                  marginBottom="20px"
                  textAlign="center"
                >
                  {t('this-is-bottom')}
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
                  {t('trash.clear')}
                </Box>
                <SVGNone />
              </Box>
            </Flex>
          )}
        </Box>
      </MailboxContainer>
    </>
  )
}
