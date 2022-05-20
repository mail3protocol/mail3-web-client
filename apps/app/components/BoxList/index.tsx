import React from 'react'
import { Avatar } from 'ui'
import { AvatarBadge, Box, Center, Circle, Flex, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import dayjs from 'dayjs'
import ChooseSVG from '../../assets/choose.svg'
import {
  AddressListResponse,
  AddressResponse,
  MessageItemResponse,
} from '../../api'
import { dynamicDateString } from '../../utils'

export enum AvatarBadgeType {
  None,
  New,
  SentOK,
  SentFail,
}

export enum ItemType {
  None,
  Fail,
}

export interface MessageItem extends MessageItemResponse {
  // ui need state
  isChoose: boolean
  avatarBadgeType: AvatarBadgeType
  itemType: ItemType
}

export interface BoxListProps {
  data: Array<MessageItem>
  onClickAvatar?: (index: number) => void
  onClickBody: (id: string) => void
  isChooseMode?: boolean
  setIsChooseMode?: React.Dispatch<React.SetStateAction<boolean>>
}

export interface BoxItemProps {
  id: string
  index: number
  subject: string
  // desc: string
  to: AddressListResponse
  from: AddressResponse
  date: string
  isChoose: boolean
  avatarBadgeType: AvatarBadgeType
  itemType: ItemType
  onClickAvatar?: (index: number) => void
  onClick?: () => void
  isChooseMode?: boolean
  setIsChooseMode?: React.Dispatch<React.SetStateAction<boolean>>
}

const CircleE = styled(Circle)`
  background: #ffffff;
  border: 3px solid #4e52f5;
  border-radius: 50px;
`

const Item = ({
  subject,
  // desc,
  date,
  isChoose,
  id,
  index,
  onClickAvatar,
  onClick,
  avatarBadgeType,
  itemType,
  to,
  from,
  isChooseMode,
  setIsChooseMode,
}: BoxItemProps) => {
  const AvatarBadgeE = {
    [AvatarBadgeType.None]: <Box />,
    [AvatarBadgeType.New]: (
      <AvatarBadge
        boxSize="10px"
        bg="#9093F9"
        top="0"
        bottom="auto"
        border="none"
      />
    ),
    [AvatarBadgeType.SentOK]: (
      <AvatarBadge boxSize="10px" bg="#000" top="0" bottom="auto" border="none">
        <CheckIcon color="#fff" w="5px" h="5px" />
      </AvatarBadge>
    ),
    [AvatarBadgeType.SentFail]: (
      <AvatarBadge
        boxSize="10px"
        bg="#FF5F57"
        top="0"
        bottom="auto"
        border="none"
      >
        <CloseIcon color="#fff" w="5px" h="5px" />
      </AvatarBadge>
    ),
  }[avatarBadgeType]

  const AvatarBox = (
    <Flex w="96px">
      <Avatar
        address={from.address}
        w="48px"
        h="48px"
        showBorder
        onClick={(e) => {
          e.stopPropagation()
          if (onClickAvatar) onClickAvatar(index)
          if (setIsChooseMode) setIsChooseMode(true)
          return false
        }}
        borderRadius="50%"
      >
        {AvatarBadgeE}
      </Avatar>
      {/* <Center
        flexGrow={1}
        w="48px"
        h="48px"
        zIndex={9}
        background="#6F6F6F"
        border="1px solid #FFFFFF"
        borderRadius="50px"
        transform="translateX(-70%)"
        onClick={(e) => {
          e.stopPropagation()
          if (update) update(index)
          setIsChooseMode(true)
          return false
        }}
      >
        10
      </Center> */}
    </Flex>
  )

  const desc = `${from?.address} - ${to
    ?.map((item) => `${item?.address}`)
    ?.join(';')}`

  return (
    <Flex
      bg={itemType === ItemType.Fail ? '#FFF9F9' : ''}
      margin="20px 0"
      p="5px"
      borderRadius="8px"
      cursor="pointer"
      transition="all .2s ease-out"
      _hover={{
        color: '#fff',
        bg: '#000000',
      }}
      // _active={{
      //   color: '#6F6F6F',
      //   bg: '#E5E5E5',
      // }}
      onClick={onClick}
    >
      <Box w="48px">
        {isChooseMode ? (
          <CircleE
            size="48px"
            onClick={(e) => {
              e.stopPropagation()
              if (onClickAvatar) onClickAvatar(index)
              console.log(id, index)
              return false
            }}
          >
            {isChoose && <ChooseSVG />}
          </CircleE>
        ) : (
          AvatarBox
        )}
      </Box>
      <Flex flex="1" padding="0px 20px" wrap="wrap" alignContent="center">
        <Text
          fontWeight="600"
          fontSize="16px"
          lineHeight={1.2}
          maxW="100%"
          w="100%"
          noOfLines={1}
        >
          {subject}
        </Text>
        <Text
          fontWeight="400"
          fontSize="14px"
          mt="8px"
          lineHeight={1.2}
          maxW="100%"
          w="100%"
          noOfLines={1}
        >
          {desc}
        </Text>
      </Flex>
      <Center w="170px" fontSize="14px" color="#6F6F6F">
        {dynamicDateString(date)}
      </Center>
    </Flex>
  )
}

export const BoxList: React.FC<BoxListProps> = ({
  data,
  onClickAvatar,
  onClickBody,
  isChooseMode,
  setIsChooseMode,
}) => (
  <Box>
    {data.map((item, index) => {
      const { id } = item
      return (
        <Item
          key={id}
          {...item}
          index={index}
          onClickAvatar={onClickAvatar}
          isChooseMode={isChooseMode}
          setIsChooseMode={setIsChooseMode}
          onClick={() => {
            onClickBody(id)
          }}
        />
      )
    })}
  </Box>
)
