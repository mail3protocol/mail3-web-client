import { Box, Button, Center, Flex, HStack, Spinner } from '@chakra-ui/react'
import React from 'react'
import styled from '@emotion/styled'

import { CloseIcon } from '@chakra-ui/icons'
import { atom, useAtomValue } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { ReactComponent as ReplySVG } from '../../assets/preview/reply-white.svg'
import { ReactComponent as ForwardSVG } from '../../assets/preview/forward-white.svg'
import { ReactComponent as TrashSVG } from '../../assets/preview/trash-white.svg'
import { ReactComponent as SpamSVG } from '../../assets/preview/spam-white.svg'
import { ReactComponent as EyeSVG } from '../../assets/mailbox/menu/eye.svg'
import { ReactComponent as EyeCloseSVG } from '../../assets/mailbox/menu/eye-close.svg'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export enum BulkActionType {
  Reply,
  Forward,
  Delete,
  Restore,
  MarkUnSeen,
  MarkSeen,
  Spam,
  NotSpam,
}

export const bulkLoadingAtom = atom({
  [BulkActionType.Delete]: false,
})

interface MailboxMenuProps {
  btnList: BulkActionType[]
  actionMap: PartialRecord<BulkActionType, () => Promise<void>>
  onClose?: () => void
}

const bulkConfig: Record<
  BulkActionType,
  {
    Icon: any
    name: string
    hasLine?: boolean
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
  [BulkActionType.Spam]: {
    hasLine: true,
    Icon: SpamSVG,
    name: 'Spam',
  },
  [BulkActionType.NotSpam]: {
    hasLine: true,
    Icon: SpamSVG,
    name: 'Not Spam',
  },
}

const LineBox = styled(Box)`
  width: 1px;
  top: 10px;
  left: 0;
  bottom: 10px;
  background-color: #c4c4c4;
  position: absolute;
`

const BulkAtion: React.FC<{
  onClick?: () => Promise<void>
  type: BulkActionType
}> = ({ onClick, type }) => {
  const { Icon, name, hasLine } = bulkConfig[type]
  const loadingMap: Record<number, boolean> = useAtomValue(bulkLoadingAtom)
  const setBulkLoadingMap = useUpdateAtom(bulkLoadingAtom)
  const isLoading = loadingMap[type]

  return (
    <Center
      p="10px 35px"
      cursor="pointer"
      position="relative"
      onClick={async () => {
        if (onClick) {
          setBulkLoadingMap((state) => ({
            ...state,
            [type]: true,
          }))
          await onClick()
          setBulkLoadingMap((state) => ({
            ...state,
            [type]: false,
          }))
        }
      }}
    >
      {hasLine ? <LineBox className="line" /> : null}
      <Flex
        direction="column"
        align="center"
        h="60px"
        justifyContent="space-evenly"
      >
        {!isLoading ? (
          <>
            <Box h="24px" w="24px">
              <Icon />
            </Box>
            <Box fontSize="18px" color="#fff" fontWeight="700">
              {name}
            </Box>
          </>
        ) : (
          <Spinner color="#fff" />
        )}
      </Flex>
    </Center>
  )
}

const BulkAtionWrap: React.FC<{
  list: BulkActionType[]
  onClickMap: MailboxMenuProps['actionMap']
  onClose?: () => void
}> = ({ list, onClickMap, onClose }) => {
  const content = list.map((type) => {
    const onClick = onClickMap[type]
    return <BulkAtion key={type} onClick={onClick} type={type} />
  })

  return (
    <Box w="100%" h="100%">
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

      <HStack spacing="0">{content}</HStack>
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
  background: #000000;
  border-radius: 32px;
  padding: 0 15px;
`

export const MailboxMenu: React.FC<MailboxMenuProps> = ({
  btnList,
  actionMap,
  onClose,
}) => (
  <Container>
    <Content>
      <BulkAtionWrap list={btnList} onClickMap={actionMap} onClose={onClose} />
    </Content>
  </Container>
)
