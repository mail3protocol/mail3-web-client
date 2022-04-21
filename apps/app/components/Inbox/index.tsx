import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import {
  Avatar,
  AvatarBadge,
  Box,
  Center,
  Flex,
  list,
  Text,
} from '@chakra-ui/react'
import { useDidMount } from '../../hooks/useDidMount'

const mock_list = {
  message: [
    {
      avatar: '',
      id: 123,
      emailId: 123,
      messageId: 123,
      unseen: true,
      date: new Date(),
      subject: 'subject subject subject',
      desc: 'The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications. The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications.',
    },
  ],
}

function Item(props) {
  console.log(props)
  return (
    <Flex margin="20px 0">
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
          {props.subject}
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
          {props.desc}
        </Text>
      </Flex>
      <Center w="170px" fontSize="14px" color="#6F6F6F">
        2022-02-01 / 12:01 am
      </Center>
    </Flex>
  )
}

function BoxList() {
  let data = mock_list.message
  data = [...data, ...data]
  data = [...data, ...data]
  data = [...data, ...data]

  return (
    <Box>
      {data.map((item) => {
        const { id } = item
        return <Item key={id} {...item} />
      })}
    </Box>
  )
}

export const InboxComponent: React.FC = () => {
  const [t] = useTranslation('inbox')
  const [list, setList] = useState([])

  useDidMount(() => {
    console.log('useDidMount')
  })

  return (
    <Box
      margin="200px auto"
      w="1280px"
      bgColor="#FFFFFF"
      boxShadow="0px 0px 10px 4px rgba(25, 25, 100, 0.1)"
      borderRadius="24px"
    >
      <Box padding="20px 64px">
        <Box>NEW</Box>
        <BoxList />
      </Box>

      <Box>SEEN</Box>
    </Box>
  )
}
