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
import { ReactComponent as MarkSeenSVG } from '../../assets/mailbox/menu/mark-as-seen.svg'
import { ReactComponent as EyeCloseSVG } from '../../assets/mailbox/menu/eye-close.svg'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export enum BulkActionType {
  Reply,
  Forward,
  Delete,
  Trash,
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
  disableMap: PartialRecord<BulkActionType, boolean>
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
  [BulkActionType.Trash]: {
    hasLine: true,
    Icon: TrashSVG,
    name: 'Trash',
  },
  [BulkActionType.Delete]: {
    Icon: TrashSVG,
    name: 'Delete',
  },
  [BulkActionType.MarkUnSeen]: {
    Icon: EyeCloseSVG,
    name: 'Mark Unseen',
  },
  [BulkActionType.MarkSeen]: {
    Icon: MarkSeenSVG,
    name: 'Mark as seen',
  },
  [BulkActionType.Spam]: {
    hasLine: false,
    Icon: SpamSVG,
    name: 'Spam',
  },
  [BulkActionType.NotSpam]: {
    hasLine: false,
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
  disable?: boolean
  useLine: boolean
  onClick?: () => Promise<void>
  type: BulkActionType
}> = ({ onClick, type, useLine, disable }) => {
  const { Icon, name, hasLine } = bulkConfig[type]
  const loadingMap: Record<number, boolean> = useAtomValue(bulkLoadingAtom)
  const setBulkLoadingMap = useUpdateAtom(bulkLoadingAtom)
  const isLoading = loadingMap[type]

  return (
    <Center
      p="10px 18px"
      cursor="pointer"
      position="relative"
      opacity={disable ? 0.5 : 1}
      onClick={async () => {
        if (disable) return
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
      {useLine && hasLine ? <LineBox className="line" /> : null}
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
  disableMap: MailboxMenuProps['disableMap']
  list: BulkActionType[]
  onClickMap: MailboxMenuProps['actionMap']
  onClose?: () => void
}> = ({ list, onClickMap, onClose, disableMap = {} }) => {
  const content = list.map((type, index) => {
    const onClick = onClickMap[type]
    const disable = disableMap[type]
    return (
      <BulkAtion
        disable={disable}
        useLine={index !== 0}
        key={type}
        onClick={onClick}
        type={type}
      />
    )
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
  width: 100%;
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
  disableMap,
  btnList,
  actionMap,
  onClose,
}) => (
  <Container>
    <Content>
      <BulkAtionWrap
        disableMap={disableMap}
        list={btnList}
        onClickMap={actionMap}
        onClose={onClose}
      />
    </Content>
  </Container>
)
