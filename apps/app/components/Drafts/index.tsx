import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Wrap, WrapItem } from '@chakra-ui/react'
import { useDialog, useToast } from 'hooks'
import { useAPI } from '../../hooks/useAPI'
import { RoutePath } from '../../route/path'
import { Mailboxes } from '../../api/mailboxes'
import { InfiniteHandle, InfiniteMailbox } from '../InfiniteMailbox'
import { MailboxContainer, NewPageContainer } from '../Inbox'

import { ReactComponent as SVGDrafts } from '../../assets/drafts.svg'
import { ReactComponent as SVGNone } from '../../assets/mailbox/none.svg'
import { Loading } from '../Loading'
import { ThisBottomStatus } from '../MailboxStatus'
import { BulkActionType, MailboxMenu } from '../MailboxMenu'
import { GotoInbox } from '../GotoInbox'

export const DraftsComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const api = useAPI()
  const dialog = useDialog()
  const toast = useToast()

  const [isChooseMode, setIsChooseMode] = useState(false)
  const refBoxList = useRef<InfiniteHandle>(null)

  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getMailboxesMessages(
        Mailboxes.Drafts,
        pageParam
      )
      return data
    },
    [api]
  )

  return (
    <NewPageContainer>
      <GotoInbox />
      {isChooseMode && (
        <MailboxMenu
          btnList={[BulkActionType.Delete]}
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
                    await api.batchDeleteMessage(ids, true)
                    refBoxList?.current?.setHiddenIds(ids)
                    toast(t('status.delete.ok'), { status: 'success' })
                  } catch (error) {
                    toast(t('status.delete.fail'))
                  }
                },
                onCancel: () => {},
              })
            },
          }}
        />
      )}
      <Flex alignItems="center" pt="24px" pl={{ base: '20px', md: 0 }}>
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
        <Box padding={{ md: '20px 64px' }}>
          <InfiniteMailbox
            ref={refBoxList}
            enableQuery
            queryFn={queryFn}
            queryKey={['Drafts']}
            loader={<Loading />}
            emptyElement={
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
            }
            noMoreElement={<ThisBottomStatus />}
            onChooseModeChange={(b) => setIsChooseMode(b)}
            onClickBody={() => {
              // report point
            }}
            getHref={(id) => ({
              pathname: RoutePath.NewMessage,
              search: `id=${id}`,
            })}
            mailboxType={Mailboxes.Drafts}
          />
        </Box>
      </MailboxContainer>
    </NewPageContainer>
  )
}
