import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { Box, Center, Container } from '@chakra-ui/react'
import { useDidMount } from '../../hooks/useDidMount'
import { BoxList } from '../BoxList'
import { InboxNav } from './Nav'
import { Navbar } from '../Navbar'

const mockList = {
  message: [
    {
      avatar: '',
      id: 123,
      emailId: 123,
      messageId: 123,
      unseen: true,
      date: '2022-02-01 / 12:01 am',
      subject: 'subject subject subject',
      desc: 'The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications. The HEY Team It’s like Mission Control for a contact. See all emails, set up delivery, toggle notifications.',
    },
  ],
}

let data: any = mockList.message
data = [...data, ...data]
data = [...data, ...data]
data = [...data, ...data]

export const InboxComponent: React.FC = () => {
  const [t] = useTranslation('inbox')
  const [messages, setMessages] = useState([])

  useDidMount(() => {
    setMessages(data)
    console.log('useDidMount')
  })

  return (
    <Box>
      <Navbar />
      <Center>
        <Box w="1280px">
          <Box paddingTop="60px">
            <InboxNav />
            <Box
              margin="25px auto"
              bgColor="#FFFFFF"
              boxShadow="0px 0px 10px 4px rgba(25, 25, 100, 0.1)"
              borderRadius="24px"
            >
              <Box padding="20px 64px">
                <Box>NEW</Box>
                <BoxList data={messages} />
              </Box>

              <Box padding="20px 64px" bg="rgba(243, 243, 243, 0.4);">
                <Box>SEEM</Box>
                <BoxList data={messages} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Center>
    </Box>
  )
}
