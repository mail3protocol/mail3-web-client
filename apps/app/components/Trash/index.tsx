import { useTranslation } from 'next-i18next'
import React, { useCallback, useState, useRef } from 'react'
import { Box, Flex, Spacer, Text, Wrap, WrapItem } from '@chakra-ui/react'
// import { Button } from 'ui'
import styled from '@emotion/styled'
import { useDialog, useToast } from 'hooks'
import { InfiniteMailbox, InfiniteHandle } from '../InfiniteMailbox'
import { useAPI } from '../../hooks/useAPI'
import { Mailboxes } from '../../api/mailboxes'
import { RoutePath } from '../../route/path'
import { MailboxContainer, NewPageContainer } from '../Inbox'
import { Loading } from '../Loading'
import { ClearStatus, ThisBottomStatus } from '../MailboxStatus'
import { BulkActionType, MailboxMenu, MailboxMenuType } from '../MailboxMenu'
// import SVGIconEmpty from '../../assets/icon-empty.svg'
import SVGTrash from '../../assets/trash.svg'

const TextBox = styled(Box)`
  margin-top: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
`

export const TrashComponent: React.FC = () => {
  const [t] = useTranslation('mailboxes')
  const api = useAPI()
  const refBoxList = useRef<InfiniteHandle>(null)
  const [isChooseMode, setIsChooseMode] = useState(false)

  const toast = useToast()
  const dialog = useDialog()

  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getMailboxesMessages(
        Mailboxes.Trash,
        pageParam
      )
      // test empty status
      // data.messages = []
      return data
    },
    [api]
  )

  return (
    <NewPageContainer>
      {isChooseMode && (
        <MailboxMenu
          type={MailboxMenuType.Base}
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
                    toast(t('status.delete.ok'))
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

      <Flex alignItems="center" pt="30px" pl={{ base: '20px', md: 0 }}>
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
          <TextBox
            textAlign={{ base: 'left', md: 'center' }}
            pl={{ base: '20px', md: 0 }}
          >
            <Text>{t('trash.auto-delete')}</Text>
          </TextBox>
          <InfiniteMailbox
            ref={refBoxList}
            enableQuery
            queryFn={queryFn}
            queryKey={['Trash']}
            loader={<Loading />}
            emptyElement={<ClearStatus />}
            noMoreElement={<ThisBottomStatus />}
            onChooseModeChange={(b) => setIsChooseMode(b)}
            onClickBody={() => {
              // report point
            }}
            getHref={(id) => ({
              pathname: `${RoutePath.Message}/${id}`,
              query: {
                origin: Mailboxes.Trash,
              },
            })}
          />
        </Box>
      </MailboxContainer>
    </NewPageContainer>
  )
}
