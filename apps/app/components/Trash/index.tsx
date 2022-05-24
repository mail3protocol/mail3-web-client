/* eslint-disable @typescript-eslint/no-use-before-define */
import { useTranslation } from 'next-i18next'
import React, { useCallback, useState } from 'react'
import { Box, Flex, Spacer, Text, Wrap, WrapItem } from '@chakra-ui/react'
// import { Button } from 'ui'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { AvatarBadgeType, InfiniteList, MessageItem } from '../BoxList'
import SVGTrash from '../../assets/trash.svg'
// import SVGIconEmpty from '../../assets/icon-empty.svg'
import { useAPI } from '../../hooks/useAPI'
import { Mailboxes } from '../../api/mailboxes'
import { RoutePath } from '../../route/path'
import SVGNone from '../../assets/none.svg'
import SVGIsBottom from '../../assets/is-bottom.svg'
import { formatState, MailboxContainer } from '../Inbox'
import { StickyButtonBox, SuspendButtonType } from '../SuspendButton'

export const TrashComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [isChooseMode, setIsChooseMode] = useState(false)

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
    // ref get list
    return []
  }, [])

  const TextBox = styled(Box)`
    margin-top: 10px;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
  `

  return (
    <>
      {isChooseMode && (
        <StickyButtonBox
          list={[
            {
              type: SuspendButtonType.Delete,
              onClick: () => {
                console.log('getChooseList', getChooseList())
                console.log('del')
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
          {/* <BoxList
            data={messages}
            onClickBody={(id) => {
              router.push(`${RoutePath.Message}/${id}`)
            }}
          /> */}
          <InfiniteList
            enableQuery
            queryFn={queryFn}
            queryKey={['Trash']}
            emptyElement="empty"
            noMoreElement="end"
            onDataChange={onDataChange}
            onChooseModeChange={onChooseModeChange}
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
