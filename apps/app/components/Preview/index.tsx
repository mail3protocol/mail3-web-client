import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Avatar } from 'ui'
import { AvatarGroup, Box, Center, Text, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import styled from '@emotion/styled'
import { useDialog } from 'hooks'
import { useTranslation } from 'next-i18next'
import { SuspendButton, SuspendButtonType } from '../SuspendButton'
import { useAPI } from '../../hooks/useAPI'
import {
  AddressListResponse,
  AddressResponse,
  FlagAction,
  FlagType,
} from '../../api'
import { dynamicDateString } from '../../utils'
import { Mailboxes } from '../../api/mailboxes'
import { RoutePath } from '../../route/path'
import { Loading } from '../Loading'

interface MeesageDetail {
  date: string
  subject: string
  to: AddressListResponse
  from: AddressResponse
}

const Container = styled(Box)`
  margin: 25px auto 150px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 24px;
  padding: 40px 60px;

  @media (max-width: 600px) {
    border-radius: 0;
    box-shadow: none;
    padding: 0px;
    margin: 20px auto 130px;
  }
`

export const PreviewComponent: React.FC = () => {
  const [t] = useTranslation('preview')
  const router = useRouter()
  const { id, origin } = router.query
  const [content, setContent] = useState('')
  const [detail, setDetail] = useState<MeesageDetail>()
  const api = useAPI()
  const dialog = useDialog()

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
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        const { messageData, html } = d
        setDetail({
          date: dayjs(messageData.date).format('YYYY-MM-DD h:mm A'),
          subject: messageData.subject,
          to: messageData.to,
          from: messageData.from,
        })
        setContent(html)

        if (typeof id !== 'string') return
        api.putMessage(id, FlagAction.add, FlagType.Seen)
      },
    }
  )

  const buttonList = useMemo(() => {
    const list = [
      {
        type: SuspendButtonType.Reply,
        onClick: () => {
          router.push({
            pathname: RoutePath.NewMessage,
            query: {
              id,
              action: 'replay',
            },
          })
        },
      },
      {
        type: SuspendButtonType.Forward,
        onClick: () => {
          router.push({
            pathname: RoutePath.NewMessage,
            query: {
              id,
              action: 'forward',
            },
          })
        },
      },
      {
        type: SuspendButtonType.Delete,
        onClick: async () => {
          if (typeof id !== 'string') {
            return
          }
          try {
            await api.deleteMessage(id)
          } catch (error) {
            dialog({
              type: 'warning',
              description: t('delete-failed'),
            })
          }
          router.back()
        },
      },
    ]

    if (origin === Mailboxes.Trash) {
      list.unshift({
        type: SuspendButtonType.Restore,
        onClick: async () => {
          if (typeof id !== 'string') return
          try {
            await api.moveMessage(id as string)
            router.replace(`${RoutePath.Message}/${id}`)
          } catch (error) {
            dialog({
              type: 'warning',
              description: t('restore-failed'),
            })
          }
        },
      })
    }

    return list
  }, [api, id, origin])

  if (!detail) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  return (
    <>
      <SuspendButton list={buttonList} />
      <Center>
        <Box bg="#F3F3F3" padding="4px" borderRadius="47px">
          <AvatarGroup size="md" max={10}>
            {detail?.from && (
              <Avatar
                w="48px"
                h="48px"
                address={detail.from.address}
                borderRadius="50%"
              />
            )}
            {detail?.to.map((item) => (
              <Avatar
                w="48px"
                h="48px"
                key={item.address}
                address={item.address}
                borderRadius="50%"
              />
            ))}
          </AvatarGroup>
        </Box>
      </Center>

      <Container>
        <Box>
          <Text
            align="center"
            fontWeight="700"
            fontSize={{ base: '20px', md: '28px' }}
            lineHeight={1.2}
            marginBottom="30px"
          >
            {detail.subject}
          </Text>
        </Box>
        <Box>
          <Flex>
            <Box w="48px">
              {detail.from && (
                <Avatar address={detail.from.address} borderRadius="50%" />
              )}
            </Box>
            <Box borderBottom="1px solid #E7E7E7;" flex={1} marginLeft="17px">
              <Flex
                lineHeight={1}
                alignItems="baseline"
                justify="space-between"
              >
                <Box>
                  <Box
                    fontWeight={500}
                    fontSize="24px"
                    lineHeight="1"
                    display="inline-block"
                    verticalAlign="middle"
                  >
                    {detail.from.name}
                  </Box>
                  <Box
                    color="#6F6F6F"
                    fontWeight={400}
                    fontSize="14px"
                    display="inline-block"
                    verticalAlign="middle"
                    marginLeft="5px"
                  >
                    {`<${detail.from.address}>`}
                  </Box>
                </Box>
                <Box />
                <Box
                  fontWeight={500}
                  fontSize="16px"
                  color="#6F6F6F"
                  whiteSpace="nowrap"
                >
                  {dynamicDateString(detail.date)}
                </Box>
              </Flex>
              <Box
                fontWeight={400}
                fontSize="16px"
                color="#6F6F6F"
                lineHeight="24px"
                marginTop="5px"
                wordBreak="break-word"
              >
                to{' '}
                {detail.to
                  .map((item) => {
                    // const address = truncateMiddle(item.address, 6, 6)
                    const { address } = item
                    if (item.name) return `${item.name} <${address}>`
                    return `<${address}>`
                  })
                  .join(';')}
              </Box>
            </Box>
          </Flex>
        </Box>
        <Box
          padding={{ base: '20px 0', md: '65px 24px' }}
          borderBottom="1px solid #ccc"
        >
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </Box>
      </Container>
    </>
  )
}
