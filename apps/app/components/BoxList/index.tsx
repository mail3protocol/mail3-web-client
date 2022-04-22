import React from 'react'
import { Avatar, AvatarBadge, Box, Center, Flex, Text } from '@chakra-ui/react'

export interface BoxItemProps {
  id: string | number
  subject: string
  desc: string
  date: string
}

export interface BoxListProps {
  data: Array<BoxItemProps>
}

const Item = ({ subject, desc, date }: BoxItemProps) => (
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
      <Avatar size="md" showBorder>
        <AvatarBadge
          boxSize="10px"
          bg="#F0871A"
          top="0"
          bottom="auto"
          border="none"
        />
      </Avatar>
    </Box>
    <Flex flex="1" padding="0px 20px" wrap="wrap" alignContent="center">
      <Text
        fontWeight="600"
        fontSize="16px"
        lineHeight="1"
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
        lineHeight={1}
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

export const BoxList: React.FC<BoxListProps> = ({ data }) => (
  <Box>
    {data.map((item) => {
      const { id } = item
      return <Item key={id} {...item} />
    })}
  </Box>
)
