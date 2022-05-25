/* eslint-disable @typescript-eslint/no-use-before-define */
import { useTranslation } from 'next-i18next'
import React, { useCallback, useRef, useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { InfiniteHandle, InfiniteList } from '../BoxList'
import { RoutePath } from '../../route/path'
import { Mailboxes } from '../../api/mailboxes'
import { useAPI } from '../../hooks/useAPI'
import { MailboxContainer } from '../Inbox'
import { StickyButtonBox, SuspendButtonType } from '../SuspendButton'

import SVGBottom from '../../assets/is-bottom.svg'

const TitleBox = styled(Box)`
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
`

export const SentComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const router = useRouter()
  const api = useAPI()

  // const [messages, setMessages] = useState<Array<MessageItem>>([])

  const refBoxList = useRef<InfiniteHandle>(null)

  const [isChooseMode, setIsChooseMode] = useState(false)

  const queryFn = useCallback(async ({ pageParam = 0 }) => {
    const { data } = await api.getMailboxesMessages(Mailboxes.Sent, pageParam)
    return data
  }, [])

  // const onDataChange = useCallback((data) => {
  //   setMessages(data)
  // }, [])

  const onChooseModeChange = useCallback((bool) => {
    setIsChooseMode(bool)
  }, [])

  const getChooseList = useCallback(() => {
    const ids = refBoxList?.current?.getChooseIds()
    return ids
  }, [])

  return (
    <>
      {isChooseMode && (
        <StickyButtonBox
          list={[
            {
              type: SuspendButtonType.Delete,
              onClick: () => {
                const ids = getChooseList()
                if (!ids?.length) return
                api.batchDeleteMessage(ids).then(() => {
                  refBoxList?.current?.setHiddenIds(ids)
                })
                console.log('del')
              },
            },
          ]}
        />
      )}
      <MailboxContainer>
        <Box padding={{ md: '20px 64px' }}>
          <TitleBox>{t('sent.title')}</TitleBox>
          <InfiniteList
            ref={refBoxList}
            enableQuery
            queryFn={queryFn}
            queryKey={['Sent']}
            emptyElement=""
            noMoreElement=""
            // onDataChange={onDataChange}
            onChooseModeChange={onChooseModeChange}
            onClickBody={(id: string) => {
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
                {t('this-is-bottom')}
              </Box>
              <SVGBottom />
            </Box>
          </Flex>
        </Box>
      </MailboxContainer>
    </>
  )
}
