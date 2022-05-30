/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Box, Flex, Wrap, WrapItem } from '@chakra-ui/react'
import { useAPI } from '../../hooks/useAPI'
import { RoutePath } from '../../route/path'
import { Mailboxes } from '../../api/mailboxes'
import { InfiniteHandle, InfiniteMailbox } from '../InfiniteMailbox'
import { MailboxContainer } from '../Inbox'

import SVGDrafts from '../../assets/drafts.svg'
import SVGNone from '../../assets/mailbox/none.svg'
import { Loading } from '../Loading'
import { ThisBottomStatus } from '../MailboxStatus'
import { BulkActionType, MailboxMenu, MailboxMenuType } from '../MailboxMenu'

export const DraftsComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const router = useRouter()
  const api = useAPI()

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
            onClickBody={(id: string) => {
              router.push(`${RoutePath.Message}/${id}`)
            }}
          />
        </Box>
      </MailboxContainer>
    </>
  )
}
