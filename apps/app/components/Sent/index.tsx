/* eslint-disable @typescript-eslint/no-use-before-define */
import { useTranslation } from 'next-i18next'
import React, { useCallback, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { InfiniteHandle, InfiniteMailbox } from '../InfiniteMailbox'
import { RoutePath } from '../../route/path'
import { Mailboxes } from '../../api/mailboxes'
import { useAPI } from '../../hooks/useAPI'
import { MailboxContainer } from '../Inbox'
import { StickyButtonBox, SuspendButtonType } from '../SuspendButton'
import { Loading } from '../Loading'
import { EmptyStatus, ThisBottomStatus } from '../MailboxStatus'
import { BulkActionType, MailboxMenu, MailboxMenuType } from '../MailboxMenu'

const TitleBox = styled(Box)`
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
`

export const SentComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const router = useRouter()
  const api = useAPI()

  const refBoxList = useRef<InfiniteHandle>(null)
  const [isChooseMode, setIsChooseMode] = useState(false)

  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getMailboxesMessages(Mailboxes.Sent, pageParam)
      return data
    },
    [api]
  )

  return (
    <>
      {isChooseMode && (
        <MailboxMenu
          type={MailboxMenuType.Base}
          actionMap={{
            [BulkActionType.Delete]: async () => {
              const ids = refBoxList?.current?.getChooseIds()
              if (!ids?.length) return
              await api.batchDeleteMessage(ids)
              refBoxList?.current?.setHiddenIds(ids)
            },
          }}
        />
      )}
      <MailboxContainer>
        <Box padding={{ md: '20px 64px' }}>
          <TitleBox>{t('sent.title')}</TitleBox>
          <InfiniteMailbox
            ref={refBoxList}
            enableQuery
            queryFn={queryFn}
            queryKey={['Sent']}
            loader={<Loading />}
            emptyElement={<EmptyStatus />}
            noMoreElement={<ThisBottomStatus />}
            onChooseModeChange={(b) => setIsChooseMode(b)}
            onClickBody={(id: string) => {
              router.push(`${RoutePath.Message}/${id}`)
            }}
          />
        </Box>
      </MailboxContainer>
    </>
  )
}
