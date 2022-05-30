import { Box, Center, HStack } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React from 'react'

import ReplySVG from '../../assets/preview/reply-white.svg'
import ForwardSVG from '../../assets/preview/forward-white.svg'
import TrashSVG from '../../assets/preview/trash-white.svg'

interface listItem {
  type: SuspendButtonType
  onClick: () => void
}

interface Props {
  list: Array<listItem>
}

export enum SuspendButtonType {
  Reply,
  Forward,
  Delete,
  Restore,
}

interface buttonItemConfig {
  Icon: React.FC
  name: string
  useLine?: boolean
}

const buttonConfig: Record<SuspendButtonType, buttonItemConfig> = {
  [SuspendButtonType.Restore]: {
    Icon: ReplySVG,
    name: 'Restore',
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
    name: 'Trash',
  },
}

const ButtonItem = styled(Center)`
  flex-direction: column;
  padding: 15px;
  :hover {
    background: #1f1f1f;
  }
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  .line {
    position: absolute;
    width: 1px;
    height: 70%;
    top: 50%;
    left: 0;
    background-color: #c4c4c4;
    transform: translateY(-50%);
  }
`

const BoxWrap = styled(Center)`
  top: 10px;
  left: 5%;
  width: calc(100% - 10%);
  position: sticky;
  z-index: 9;

  .content {
    top: 0;
    position: absolute;
  }

  .sticky {
    top: 0;
    position: sticky;
  }
`

export const StickyButtonBox: React.FC<Props> = (props) => {
  const { list } = props

  return (
    <BoxWrap>
      <Box className="content">
        <Box className="sticky">
          <Box>
            <HStack
              borderRadius="32px"
              background="#000"
              fontSize="18px"
              spacing="0px"
              color="#fff"
              overflow="hidden"
            >
              {list.map((item) => {
                const { onClick, type } = item
                const config = buttonConfig[type]
                const { Icon, name } = config

                return (
                  <ButtonItem key={type} onClick={onClick}>
                    <Box>
                      <Icon />
                    </Box>
                    <Box>{name}</Box>
                  </ButtonItem>
                )
              })}
            </HStack>
          </Box>
        </Box>
      </Box>
    </BoxWrap>
  )
}

export const SuspendButton: React.FC<Props> = (props) => {
  const { list } = props

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
        background="#000"
        fontSize="18px"
        spacing="0px"
        color="#fff"
        overflow="hidden"
      >
        {list.map((item) => {
          const { onClick, type } = item
          const config = buttonConfig[type]
          const { Icon, name, useLine } = config

          return (
            <ButtonItem key={type} onClick={onClick}>
              {useLine && <Box className="line" />}
              <Box>
                <Icon />
              </Box>
              <Box>{name}</Box>
            </ButtonItem>
          )
        })}
      </HStack>
    </Box>
  )
}
