import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { Box, Flex, Spacer, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { atom, useAtom } from 'jotai'
import { useDidMount } from 'hooks'
import { Button } from 'ui'
import styled from '@emotion/styled'
import { BoxList } from '../BoxList'
import SVGTrash from '../../assets/trash.svg'
import SVGIconEmpty from '../../assets/icon-empty.svg'

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

export const TrashComponent: React.FC = () => {
  const [t] = useTranslation('inbox')
  const [messages, setMessages] = useState([])

  useDidMount(() => {
    console.log('TrashComponent useDidMount')
    setMessages(data)
  })

  const TextBox = styled(Box)`
    margin-top: 10px;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
  `

  return (
    <>
      <Flex alignItems="center">
        <Wrap>
          <WrapItem alignItems="center">
            <SVGTrash />
          </WrapItem>
          <WrapItem
            alignItems="center"
            fontStyle="normal"
            fontWeight="700"
            fontSize="24px"
            lineHeight="30px"
          >
            Trash
          </WrapItem>
        </Wrap>

        <Spacer />
        <Button>
          <SVGIconEmpty />
          <Box marginLeft="10px">Empty</Box>
        </Button>
      </Flex>
      <Box
        margin="25px auto"
        bgColor="#FFFFFF"
        boxShadow="0px 0px 10px 4px rgba(25, 25, 100, 0.1)"
        borderRadius="24px"
      >
        <Box>
          <Box padding="20px 64px">
            <TextBox>
              <Text>
                Messages that have been in Trash more than 30 days will be
                automatically deleted.
              </Text>
            </TextBox>
            <BoxList data={messages} />
          </Box>
        </Box>
      </Box>
    </>
  )
}
