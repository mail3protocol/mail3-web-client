import { Box, Button, HStack, StyleProps, VStack } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { atom, useAtomValue } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { ReactComponent as ReplySVG } from '../../assets/preview/reply-white.svg'
import { ReactComponent as ForwardSVG } from '../../assets/preview/forward-white.svg'
import { ReactComponent as TrashSVG } from '../../assets/preview/trash-white.svg'
import { ReactComponent as SpamSVG } from '../../assets/preview/spam-white.svg'
import { ReactComponent as MoreSVG } from '../../assets/preview/more-white.svg'
import { ReactComponent as ReplyAllSVG } from '../../assets/preview/reply-all-white.svg'

interface listItem {
  type: SuspendButtonType
  isDisabled?: boolean
  onClick: () => Promise<void>
}

export enum SuspendButtonType {
  Restore,
  Reply,
  ReplyAll,
  Forward,
  Delete,
  Trash,
  Spam,
  NotSpam,
  More,
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
    propsStyle: { w: '150px' },
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
  [SuspendButtonType.More]: {
    Icon: MoreSVG,
    name: 'More',
  },
  [SuspendButtonType.ReplyAll]: {
    Icon: ReplyAllSVG,
    name: 'Reply all',
  },
}

const ButtonItem = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 14px 16px 10px;
  height: 80px;
  :hover {
    background: rgba(255, 255, 255, 0.2);
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

export const SuspendButton: React.FC<{
  list: Array<listItem>
}> = (props) => {
  const { list } = props
  const loadingMap: Record<number, boolean> = useAtomValue(SuspendButtonAtom)
  const setLoadingMap = useUpdateAtom(SuspendButtonAtom)
  const [isMore, setIsMore] = useState(false)
  const [disableClickMore, setDisableClickMore] = useState(false)
  const verticleWrapRef = useRef<HTMLDivElement>(null)

  const isNeedMore = list.length > 4

  const verticleList = isNeedMore ? list.slice(3) : []

  const horizonList = useMemo(() => list.slice(0, isNeedMore ? 3 : 4), [list])

  useEffect(() => {
    verticleWrapRef.current?.addEventListener('blur', () => {
      setIsMore(false)
      setDisableClickMore(true)
      setTimeout(() => {
        setDisableClickMore(false)
      }, 100)
    })
  }, [verticleWrapRef.current])

  return (
    <Box
      position="fixed"
      left="50%"
      bottom="20px"
      transform="translateX(-50%)"
      zIndex={99}
    >
      <Box ref={verticleWrapRef} tabIndex={0}>
        <VStack
          display={isMore ? 'flex' : 'none'}
          borderRadius="32px"
          bg="#000"
          fontSize="18px"
          spacing="0"
          color="#fff"
          overflow="hidden"
          p="15px"
          position="absolute"
          bottom="110%"
          right="0"
        >
          {verticleList.map((item) => {
            const { onClick, type, isDisabled } = item
            const config = buttonConfig[type]
            const { Icon, name, propsStyle } = config
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
        </VStack>
      </Box>
      <HStack
        borderRadius="32px"
        bg="#000"
        fontSize="18px"
        spacing="0"
        color="#fff"
        overflow="hidden"
        px="25px"
      >
        {horizonList.map((item) => {
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
        {verticleList.length ? (
          <ButtonItem
            onClick={() => {
              if (disableClickMore) return
              setIsMore(true)
              verticleWrapRef.current?.focus()
            }}
            variant="unstyled"
            opacity={isMore ? '0.2' : '1'}
          >
            <Box>
              <MoreSVG />
            </Box>
            <Box
              mt="10px"
              fontWeight="bold"
              fontSize={{ base: '14px', md: '18px' }}
            >
              {buttonConfig[SuspendButtonType.More].name}
            </Box>
          </ButtonItem>
        ) : null}
      </HStack>
    </Box>
  )
}
