import { Box, Button, HStack, useMediaQuery, VStack } from '@chakra-ui/react'
import React from 'react'
import styled from '@emotion/styled'

import { CloseIcon } from '@chakra-ui/icons'
import { atom, useAtomValue } from 'jotai'
import { ReactComponent as ReplySVG } from '../../assets/preview/reply-white.svg'
import { ReactComponent as ForwardSVG } from '../../assets/preview/forward-white.svg'
import { ReactComponent as TrashSVG } from '../../assets/mailbox/menu/trash.svg'
import { ReactComponent as EyeSVG } from '../../assets/mailbox/menu/eye.svg'
import { ReactComponent as EyeCloseSVG } from '../../assets/mailbox/menu/eye-close.svg'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export enum MailboxMenuType {
  Base, // trash
  MarkSeen, // mark seen,trash
  MarkUnSeen, // mark unseen, trash
  MarkBoth, // mark new, mark seen, trash
  Restore, // restore, trash
}

export enum BulkActionType {
  Reply,
  Forward,
  Delete,
  Restore,
  MarkUnSeen,
  MarkSeen,
}

export const bulkLoadingAtom = atom({
  [BulkActionType.Delete]: false,
})

interface MailboxMenuProps {
  type: MailboxMenuType
  actionMap: PartialRecord<BulkActionType, () => void>
  onClose?: () => void
}

const menuConfig: Record<MailboxMenuType, BulkActionType[]> = {
  [MailboxMenuType.Base]: [BulkActionType.Delete],
  [MailboxMenuType.MarkSeen]: [BulkActionType.MarkSeen, BulkActionType.Delete],
  [MailboxMenuType.MarkUnSeen]: [
    BulkActionType.MarkUnSeen,
    BulkActionType.Delete,
  ],
  [MailboxMenuType.MarkBoth]: [
    BulkActionType.MarkSeen,
    BulkActionType.MarkUnSeen,
    BulkActionType.Delete,
  ],
  [MailboxMenuType.Restore]: [BulkActionType.Restore, BulkActionType.Delete],
}

const bulkConfig: Record<
  BulkActionType,
  {
    Icon: any
    name: string
  }
> = {
  [BulkActionType.Restore]: {
    Icon: ReplySVG,
    name: 'Restore',
  },
  [BulkActionType.Reply]: {
    Icon: ReplySVG,
    name: 'Reply',
  },
  [BulkActionType.Forward]: {
    Icon: ForwardSVG,
    name: 'Forward',
  },
  [BulkActionType.Delete]: {
    Icon: TrashSVG,
    name: 'Trash',
  },
  [BulkActionType.MarkUnSeen]: {
    Icon: EyeCloseSVG,
    name: 'Mark Unseen',
  },
  [BulkActionType.MarkSeen]: {
    Icon: EyeSVG,
    name: 'Mark Seen',
  },
}

const BulkAtion: React.FC<{
  onClick?: () => void
  type: BulkActionType
}> = ({ onClick, type }) => {
  const { Icon, name } = bulkConfig[type]
  const loadingMap: Record<number, boolean> = useAtomValue(bulkLoadingAtom)
  const isLoading = loadingMap[type]

  return (
    <Button
      height="50px"
      leftIcon={<Icon />}
      variant="solid"
      disabled={isLoading}
      isLoading={isLoading}
      loadingText="deleting..."
      onClick={() => {
        if (onClick) onClick()
      }}
    >
      {name}
    </Button>
  )
}

const BulkAtionWrap: React.FC<{
  list: BulkActionType[]
  onClickMap: MailboxMenuProps['actionMap']
  onClose?: () => void
}> = ({ list, onClickMap, onClose }) => {
  const [isMaxWdith600] = useMediaQuery(`(max-width: 600px)`)

  const content = list.map((type) => {
    const onClick = onClickMap[type]
    return <BulkAtion key={type} onClick={onClick} type={type} />
  })

  return (
    <Box>
      <Button
        hidden
        className="close"
        variant="unstyled"
        size="sm"
        borderRadius="50%"
        _focus={{ boxShadow: 'none' }}
        onClick={() => {
          if (onClose) onClose()
        }}
      >
        <CloseIcon />
      </Button>

      {!isMaxWdith600 ? (
        <HStack spacing="15px">{content}</HStack>
      ) : (
        <VStack spacing="15px" align="stretch">
          {content}
        </VStack>
      )}
    </Box>
  )
}

const Container = styled(Box)`
  top: 10px;
  left: 5%;
  width: calc(100% - 10%);
  position: sticky;
  display: flex;
  justify-content: center;
  z-index: 9;

  @media (max-width: 600px) {
    justify-content: right;
  }

  .close {
    z-index: 9;
    right: -2px;
    top: -2px;
    position: absolute;
  }
`

const Content = styled(Box)`
  top: 0;
  position: absolute;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 10px;
  padding: 25px;
`

export const MailboxMenu: React.FC<MailboxMenuProps> = ({
  type,
  actionMap,
  onClose,
}) => (
  <Container>
    <Content>
      <BulkAtionWrap
        list={menuConfig[type]}
        onClickMap={actionMap}
        onClose={onClose}
      />
    </Content>
  </Container>
)
