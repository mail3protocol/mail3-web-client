/* eslint-disable @typescript-eslint/no-use-before-define */
import { useTranslation } from 'next-i18next'
import React, { useCallback, useState, useRef } from 'react'
import { Box, Flex, Spacer, Text, Wrap, WrapItem } from '@chakra-ui/react'
// import { Button } from 'ui'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { InfiniteList, InfiniteHandle, MessageItem } from '../BoxList'
import SVGTrash from '../../assets/trash.svg'
// import SVGIconEmpty from '../../assets/icon-empty.svg'
import { useAPI } from '../../hooks/useAPI'
import { Mailboxes } from '../../api/mailboxes'
import { RoutePath } from '../../route/path'
import SVGNone from '../../assets/none.svg'
import SVGIsBottom from '../../assets/is-bottom.svg'
import { MailboxContainer } from '../Inbox'
import { StickyButtonBox, SuspendButtonType } from '../SuspendButton'

const TextBox = styled(Box)`
  margin-top: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
`

export const TrashComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [isChooseMode, setIsChooseMode] = useState(false)
  const refBoxList = useRef<InfiniteHandle>(null)
  const router = useRouter()

  const api = useAPI()

  const queryFn = useCallback(async ({ pageParam = 0 }) => {
    const { data } = await api.getMailboxesMessages(Mailboxes.Trash, pageParam)
    return data
  }, [])

  const onDataChange = useCallback((data) => {
    setMessages(data)
  }, [])

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
              onClick: async () => {
                const ids = getChooseList()
                if (!ids?.length) return
                await api.batchDeleteMessage(ids)
                refBoxList?.current?.setHiddenIds(ids)
              },
            },
          ]}
        />
      )}

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
        {/* <Button
          onClick={() => {
            console.log('empty')
          }}
        >
          <SVGIconEmpty />
          <Box marginLeft="10px">{t('trash.empty')}</Box>
        </Button> */}
      </Flex>
      <MailboxContainer>
        <Box padding={{ md: '20px 64px' }}>
          <TextBox>
            <Text>{t('trash.auto-delete')}</Text>
          </TextBox>
          <InfiniteList
            ref={refBoxList}
            enableQuery
            queryFn={queryFn}
            queryKey={['Trash']}
            emptyElement=""
            noMoreElement=""
            onDataChange={onDataChange}
            onChooseModeChange={onChooseModeChange}
            onClickBody={(id: string) => {
              router.push({
                pathname: `${RoutePath.Message}/${id}`,
                query: {
                  origin: Mailboxes.Trash,
                },
              })
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
