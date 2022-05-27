import { Box, Button, HStack, VStack } from '@chakra-ui/react'
import React from 'react'

import styled from '@emotion/styled'
import ReplySVG from '../../assets/reply-white.svg'
import ForwardSVG from '../../assets/forward-white.svg'
import TrashSVG from '../../assets/trash-white.svg'
import EyeSVG from '../../assets/mailbox-button-icon/eye.svg'
import EyeCloseSVG from '../../assets/mailbox-button-icon/eye-close.svg'

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

interface MailboxMenuProps {
  type: MailboxMenuType
  actionMap: PartialRecord<BulkActionType, () => void>
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
  return (
    <Button
      leftIcon={<Icon />}
      variant="solid"
      onClick={() => {
        if (onClick) onClick()
      }}
    >
      {name}
    </Button>
  )
}

const BulkWrap = styled(Box)`
  .h-stack {
    display: block;
  }

  .v-stack {
    display: none;
  }

  @media (max-width: 600px) {
    .h-stack {
      display: none;
    }

    .v-stack {
      display: block;
    }
  }
`

const BulkAtionWrap: React.FC<{
  list: BulkActionType[]
  onClickMap: MailboxMenuProps['actionMap']
}> = ({ list, onClickMap }) => {
  const content = list.map((type) => {
    const onClick = onClickMap[type]
    if (onClick) return <BulkAtion key={type} onClick={onClick} type={type} />
    return <BulkAtion key={type} type={type} />
  })

  return (
    <BulkWrap>
      <Box className="h-stack">
        <HStack spacing="20px">{content}</HStack>
      </Box>
      <Box className="v-stack">
        <VStack spacing="20px" align="stretch">
          {content}
        </VStack>
      </Box>
    </BulkWrap>
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
`

const Content = styled(Box)`
  top: 0;
  position: absolute;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 10px;
  padding: 20px;
`

export const MailboxMenu: React.FC<MailboxMenuProps> = ({
  type,
  actionMap,
}) => {
  const list = menuConfig[type]

  return (
    <Container>
      <Content>
        <BulkAtionWrap list={list} onClickMap={actionMap} />
      </Content>
    </Container>
  )
}
