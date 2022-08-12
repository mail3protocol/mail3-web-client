import { Box, Button, HStack, StyleProps } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React from 'react'

import { atom, useAtomValue } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { ReactComponent as ReplySVG } from '../../assets/preview/reply-white.svg'
import { ReactComponent as ForwardSVG } from '../../assets/preview/forward-white.svg'
import { ReactComponent as TrashSVG } from '../../assets/preview/trash-white.svg'
import { ReactComponent as SpamSVG } from '../../assets/preview/spam-white.svg'

interface listItem {
  type: SuspendButtonType
  isDisabled?: boolean
  onClick: () => Promise<void>
}

export enum SuspendButtonType {
  Restore,
  Reply,
  Forward,
  Delete,
  Trash,
  Spam,
  NotSpam,
}

interface buttonItemConfig {
  Icon: React.FC
  name: string
  propsStyle?: StyleProps
  useLine?: boolean
}

const buttonConfig: Record<SuspendButtonType, buttonItemConfig> = {
  [SuspendButtonType.Restore]: {
    Icon: ReplySVG,
    name: 'Restore',
    propsStyle: { w: '200px' },
  },
  [SuspendButtonType.Reply]: {
    Icon: ReplySVG,
    name: 'Reply',
  },
  [SuspendButtonType.Forward]: {
    Icon: ForwardSVG,
    name: 'Forward',
  },
  [SuspendButtonType.Delete]: {
    useLine: true,
    Icon: TrashSVG,
    name: 'Delete',
  },
  [SuspendButtonType.Trash]: {
    useLine: true,
    Icon: TrashSVG,
    name: 'Trash',
  },
  [SuspendButtonType.Spam]: {
    Icon: SpamSVG,
    name: 'Spam',
  },
  [SuspendButtonType.NotSpam]: {
    Icon: ReplySVG,
    name: 'Not Spam',
    propsStyle: { w: '200px' },
  },
}

const ButtonItem = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 14px 16px 8px;
  height: 80px;
  :hover {
    background: #1f1f1f;
  }
  position: relative;
  transition: background 0.2s ease;

  .line {
    position: absolute;
    width: 1px;
    height: 70%;
    top: 50%;
    left: 0;
    background-color: #c4c4c4;
    transform: translateY(-50%);
  }

  @media (max-width: 600px) {
    padding: 14px 14px 8px;
  }
`

const SuspendButtonAtom = atom({
  [SuspendButtonType.Delete]: false,
  [SuspendButtonType.Trash]: false,
  [SuspendButtonType.Spam]: false,
  [SuspendButtonType.NotSpam]: false,
})

export const SuspendButton: React.FC<{ list: Array<listItem> }> = (props) => {
  const { list } = props
  const loadingMap: Record<number, boolean> = useAtomValue(SuspendButtonAtom)
  const setLoadingMap = useUpdateAtom(SuspendButtonAtom)

  return (
    <Box
      position="fixed"
      left="50%"
      bottom="20px"
      transform="translateX(-50%)"
      zIndex={99}
    >
      <HStack
        borderRadius="32px"
        bg="#000"
        fontSize="18px"
        spacing="0"
        color="#fff"
        overflow="hidden"
        px="34px"
      >
        {list.map((item) => {
          const { onClick, type, isDisabled } = item
          const config = buttonConfig[type]
          const { Icon, name, useLine, propsStyle } = config
          const isLoading = loadingMap[type]

          return (
            <ButtonItem
              key={type}
              onClick={async () => {
                if (isLoading) return
                if (onClick) {
                  setLoadingMap((state) => ({
                    ...state,
                    [type]: true,
                  }))
                  await onClick()
                  setLoadingMap((state) => ({
                    ...state,
                    [type]: false,
                  }))
                }
              }}
              isLoading={isLoading}
              variant="unstyled"
              disabled={isDisabled}
              {...propsStyle}
            >
              {useLine && <Box className="line" />}
              <Box>
                <Icon />
              </Box>
              <Box
                mt="10px"
                fontWeight="bold"
                fontSize={{ base: '14px', md: '18px' }}
              >
                {name}
              </Box>
            </ButtonItem>
          )
        })}
      </HStack>
    </Box>
  )
}
