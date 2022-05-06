import React from 'react'
import {
  Avatar,
  AvatarBadge,
  Box,
  Center,
  Circle,
  Flex,
  Text,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { atom, useAtom } from 'jotai'
import ChooseSVG from '../../assets/choose.svg'

export interface BoxItemProps {
  id: string | number
  index: number
  subject: string
  desc: string
  date: string
  isChoose: boolean
}

export interface BoxListProps {
  data: Array<BoxItemProps>
  update?: (index: number) => void
}

const CircleE = styled(Circle)`
  background: #ffffff;
  border: 3px solid #4e52f5;
  border-radius: 50px;
`

export const isChooseModeAtom = atom<boolean>(false)

const Item = ({ subject, desc, date, isChoose, id, index }: BoxItemProps) => {
  const [isChooseMode, setIsChooseMode] = useAtom(isChooseModeAtom)
  return (
    <Flex
      margin="20px 0"
      p="5px"
      borderRadius="8px"
      cursor="pointer"
      transition="all .2s ease-out"
      _hover={{
        color: '#fff',
        bg: '#000000',
      }}
      _active={{
        color: '#6F6F6F',
        bg: '#E5E5E5',
      }}
    >
      <Box w="48px">
        {isChooseMode && (
          <CircleE
            size="48px"
            onClick={() => {
              console.log(id, index)
            }}
          >
            {isChoose && <ChooseSVG />}
          </CircleE>
        )}
        {!isChooseMode && (
          <Avatar
            size="md"
            showBorder
            onClick={() => {
              setIsChooseMode(true)
            }}
          >
            <AvatarBadge
              boxSize="10px"
              bg="#9093F9"
              top="0"
              bottom="auto"
              border="none"
            />
          </Avatar>
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
        {date}
      </Center>
    </Flex>
  )
}

export const BoxList: React.FC<BoxListProps> = ({ data }) => (
  <Box>
    {data.map((item, index) => {
      const { id } = item
      return <Item key={id} {...item} index={index} />
    })}
  </Box>
)
