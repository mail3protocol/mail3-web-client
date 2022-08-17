import { useTranslation } from 'react-i18next'
import React, { useState, useRef } from 'react'
import { Box, Flex, Spacer, Text, Wrap, WrapItem } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useDialog, useToast } from 'hooks'
import { createSearchParams, generatePath } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { InfiniteMailbox, InfiniteHandle } from '../InfiniteMailbox'
import { useAPI } from '../../hooks/useAPI'
import { Mailboxes } from '../../api/mailboxes'
import { RoutePath } from '../../route/path'
import { MailboxContainer, NewPageContainer } from '../Inbox'
import { Loading } from '../Loading'
import { ClearStatus, ThisBottomStatus } from '../MailboxStatus'
import { BulkActionType, MailboxMenu } from '../MailboxMenu'
import { ReactComponent as SpamSvg } from '../../assets/spam.svg'
import { GotoInbox } from '../GotoInbox'
import { userPropertiesAtom } from '../../hooks/useLogin'

const TextBox = styled(Box)`
  margin-top: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
`

export const SpamComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const api = useAPI()
  const refBoxList = useRef<InfiniteHandle>(null)
  const [isChooseMode, setIsChooseMode] = useState(false)
  const userProps = useAtomValue(userPropertiesAtom)

  const toast = useToast()
  const dialog = useDialog()

  const queryFn = async ({ pageParam = 0 }) => {
    const { data } = await api.getMailboxesMessages(Mailboxes.Spam, pageParam)
    return data
  }

  return (
    <NewPageContainer>
      <GotoInbox />
      {isChooseMode && (
        <MailboxMenu
          btnList={[BulkActionType.Delete, BulkActionType.NotSpam]}
          actionMap={{
            [BulkActionType.Delete]: async () => {
              const ids = refBoxList?.current?.getChooseIds()
              if (!ids?.length) return

              dialog({
                type: 'text',
                title: t('confirm.delete.title'),
                description: t('confirm.delete.description'),
                okText: 'Yes',
                cancelText: 'Cancel',
                modalProps: {
                  isOpen: false,
                  onClose: () => {},
                  size: 'md', // this size mobile is ugly, pc is better
                  children: '',
                },
                onConfirm: async () => {
                  try {
                    await api.batchDeleteMessage(ids)
                    refBoxList?.current?.setHiddenIds(ids)
                    toast(t('status.delete.ok'), { status: 'success' })
                  } catch (error) {
                    toast(t('status.delete.fail'))
                  }
                },
                onCancel: () => {},
              })
            },
            [BulkActionType.NotSpam]: async () => {
              const msg = refBoxList?.current?.getChooseMsgs()
              if (!msg?.length) return

              const sendIds: string[] = []
              const inboxIds: string[] = []

              msg.forEach((item) => {
                if (!item) return
                if (
                  userProps?.aliases.some(
                    (_item: { address: string }) =>
                      _item.address === item?.from.address
                  )
                ) {
                  sendIds.push(item.id)
                } else {
                  inboxIds.push(item.id)
                }
              })

              try {
                if (sendIds.length)
                  await api.batchMoveMessage(sendIds, Mailboxes.Sent)
                await api.batchMoveMessage(inboxIds, Mailboxes.INBOX)
                refBoxList?.current?.setHiddenIds([...sendIds, ...inboxIds])
                toast(t('status.notSpam.ok'), { status: 'success' })
              } catch (error) {
                toast(t('status.notSpam.fail'))
              }
            },
          }}
        />
      )}

      <Flex alignItems="center" pt="24px" pl={{ base: '20px', md: 0 }}>
        <Wrap>
          <WrapItem alignItems="center">
            <SpamSvg />
          </WrapItem>
          <WrapItem
            alignItems="center"
            fontStyle="normal"
            fontWeight="700"
            fontSize="24px"
            lineHeight="30px"
          >
            {t('spam.title')}
          </WrapItem>
        </Wrap>

        <Spacer />
        {/* <Button
          onClick={() => {
            console.log('empty')
          }}
        >
          <SVGIconEmpty />
          <Box marginLeft="10px">{t('spam.empty')}</Box>
        </Button> */}
      </Flex>
      <MailboxContainer>
        <Box padding={{ md: '20px 64px' }}>
          <TextBox
            textAlign={{ base: 'left', md: 'center' }}
            pl={{ base: '20px', md: 0 }}
          >
            <Text>{t('spam.auto-delete')}</Text>
          </TextBox>
          <InfiniteMailbox
            mailboxType={Mailboxes.Spam}
            ref={refBoxList}
            enableQuery
            queryFn={queryFn}
            queryKey={['spam']}
            loader={<Loading />}
            emptyElement={<ClearStatus nameKey="spam.clear" />}
            noMoreElement={<ThisBottomStatus />}
            onChooseModeChange={(b) => setIsChooseMode(b)}
            onClickBody={() => {
              // report point
            }}
            getHref={(id) => ({
              pathname: generatePath(`${RoutePath.Message}/:id`, { id }),
              search: createSearchParams({
                origin: Mailboxes.Spam,
              }).toString(),
            })}
          />
        </Box>
      </MailboxContainer>
    </NewPageContainer>
  )
}
