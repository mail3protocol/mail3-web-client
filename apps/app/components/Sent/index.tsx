import { useTranslation } from 'react-i18next'
import React, { useCallback, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useToast } from 'hooks'
import { InfiniteHandle, InfiniteMailbox } from '../InfiniteMailbox'
import { RoutePath } from '../../route/path'
import { Mailboxes } from '../../api/mailboxes'
import { useAPI } from '../../hooks/useAPI'
import { MailboxContainer, NewPageContainer } from '../Inbox'
import { Loading } from '../Loading'
import { EmptyStatus, ThisBottomStatus } from '../MailboxStatus'
import { BulkActionType, MailboxMenu } from '../MailboxMenu'
import { GotoInbox } from '../GotoInbox'
import { Query } from '../../api/query'

const TitleBox = styled(Box)`
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
`

export const SentComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const api = useAPI()

  const refBoxList = useRef<InfiniteHandle>(null)
  const [isChooseMode, setIsChooseMode] = useState(false)
  const toast = useToast()

  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getMailboxesMessages(Mailboxes.Sent, pageParam)
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
              try {
                await api.batchDeleteMessage(ids)
                refBoxList?.current?.setHiddenIds(ids)
                toast(t('status.trash.ok'), { status: 'success' })
              } catch (error) {
                toast(t('status.trash.fail'))
              }
            },
          }}
        />
      )}
      <MailboxContainer>
        <Box padding={{ md: '20px 64px', base: '24px 0 0 0' }}>
          <TitleBox pl={{ base: '20px', md: 0 }}>{t('sent.title')}</TitleBox>
          <InfiniteMailbox
            ref={refBoxList}
            enableQuery
            queryFn={queryFn}
            queryKey={[Query.Sent]}
            loader={<Loading />}
            emptyElement={<EmptyStatus />}
            noMoreElement={<ThisBottomStatus />}
            onChooseModeChange={(b) => setIsChooseMode(b)}
            onClickBody={() => {
              // report point
            }}
            getHref={(id) => `${RoutePath.Message}/${id}`}
            mailboxType={Mailboxes.Sent}
          />
        </Box>
      </MailboxContainer>
    </NewPageContainer>
  )
}
