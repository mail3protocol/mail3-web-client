import React, { useEffect, useRef, useState } from 'react'
import { AvatarGroup, Box, Center, Avatar, Text, Flex } from '@chakra-ui/react'
import { useDidMount } from 'hooks'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import { SuspendButton, SuspendButtonType } from '../SuspendButton'
import { useAPI } from '../../hooks/useAPI'
import { AddressListResponse, AddressResponse } from '../../api'

interface MeesageDetail {
  date: string
  subject: string
  to: AddressListResponse
  from: AddressResponse
}

export const PreviewComponent: React.FC = () => {
  // const [data, setData] = useState(mockData)
  const router = useRouter()
  const { id } = router.query
  const contentRef = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState('')
  const [detail, setDetail] = useState<MeesageDetail>()
  const api = useAPI()

  useDidMount(() => {
    console.log('PreviewComponent useDidMount', id)
  })

  useQuery(
    ['preview', id],
    async () => {
      if (typeof id !== 'string') return {}
      const { data: messageData } = await api.getMessageData(id)
      const { data: textData } = await api.getTextData(messageData.text.id)

      return {
        messageData,
        html: textData.html,
      }
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        console.log(d)
        const { messageData, html } = d
        setDetail({
          date: dayjs(messageData.date).format('YYYY-MM-DD h:mm A'),
          subject: messageData.subject,
          to: messageData.to,
          from: messageData.from,
        })
        setContent(html)
      },
    }
  )

  return (
    <>
      <SuspendButton
        list={[
          {
            type: SuspendButtonType.Reply,
            onClick: () => {
              console.log('replay')
            },
          },
          {
            type: SuspendButtonType.Forward,
            onClick: () => {
              console.log('Forward')
            },
          },
          {
            type: SuspendButtonType.Delete,
            onClick: () => {
              console.log('Delete')
            },
          },
        ]}
      />
      <Center>
        <Box bg="#F3F3F3" padding="4px" borderRadius="47px">
          <AvatarGroup size="md" max={10}>
            {detail?.from && <Avatar name={detail?.from.name} />}
            {detail?.to.map((item) => (
              <Avatar name={item.name} key={item.address} />
            ))}
          </AvatarGroup>
        </Box>
      </Center>
      <Box
        margin="25px auto"
        bgColor="#FFFFFF"
        boxShadow="0px 0px 10px 4px rgba(25, 25, 100, 0.1)"
        borderRadius="24px"
        padding="40px 60px"
      >
        <Box>
          <Text
            align="center"
            fontWeight="700"
            fontSize="28px"
            lineHeight={1.2}
          >
            {detail?.subject}
          </Text>
        </Box>
        <Box>
          <Flex>
            <Box w="48px">
              <Avatar />
            </Box>
            <Box borderBottom="1px solid #E7E7E7;" flex={1} marginLeft="17px">
              <Flex
                lineHeight={1.2}
                alignItems="flex-end"
                justify="space-between"
              >
                <Box>
                  <Box
                    fontWeight={500}
                    fontSize="24px"
                    display="inline-block"
                    verticalAlign="middle"
                  >
                    {detail?.from.name}
                  </Box>
                  <Box
                    color="#6F6F6F"
                    fontWeight={400}
                    fontSize="14px"
                    display="inline-block"
                    verticalAlign="middle"
                    marginLeft="5px"
                  >
                    {detail?.from.address}
                  </Box>
                </Box>
                <Box />
                <Box fontWeight={500} fontSize="16px" color="#6F6F6F">
                  {detail?.date}
                </Box>
              </Flex>
              <Box fontWeight={500} fontSize="16px" color="#6F6F6F">
                to{' '}
                {detail?.to
                  .map((item) => {
                    if (item.name) return `${item.name} <${item.address}>`
                    return `<${item.address}>`
                  })
                  .join(';')}
              </Box>
            </Box>
          </Flex>
        </Box>
        <Box paddingTop="24px" paddingLeft="65px">
          <div
            ref={contentRef}
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </Box>
      </Box>
    </>
  )
}
