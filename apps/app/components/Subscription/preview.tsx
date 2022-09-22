import { Avatar, Box, Center, Flex, Spacer, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { atom, useAtomValue } from 'jotai'
import { Subscription } from 'models'
import React, { useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import { RenderHTML } from '../Preview/parser'

export const SubPreviewIdAtom = atom<string>('')

const Container = styled(Box)`
  flex: 2;
  height: 100%;
  padding: 55px;
  overflow: hidden;
  overflow-y: scroll;
`

export const SubPreview: React.FC = () => {
  const id = useAtomValue(SubPreviewIdAtom)

  const { data, isLoading } = useQuery<Subscription.MessageDetailResp>(
    ['subscriptionDetail', id],
    () =>
      new Promise((r) => {
        setTimeout(() => {
          const mock = {
            uuid: 'string',
            subject: id,
            writer_name: 'string',
            writer_uuid: 'string',
            content: `
        Things you can do on a contact’s page
    Decide if their email should go to The Imbox, The Feed, or The Paper Trail. Just click the “Delivering to...” button under their name. If you change the destination, all existing and future email will be moved automatically.

    Automatically label their email. Always want someone’s emails to go into a specific label? Easy, just click the “Autofile...” button and pick the label.

    Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.

        `,
            created_at: 'string',
          }
          r(mock)
        }, 1000)
      }),
    {}
  )

  useEffect(() => {
    console.log('preview', id)
  }, [id])
  console.log(data)
  const detail = useMemo(() => data, [data])

  // loading
  if (isLoading) {
    return <Container>loading</Container>
  }

  // empty
  if (!detail) {
    return <Container>empty</Container>
  }

  return (
    <Container>
      <Flex w="100%" align="center">
        <Flex align="center">
          <Avatar w="43px" h="43px" />
          <Box ml="15px" fontWeight={600} fontSize="14px">
            {detail?.writer_name}
          </Box>
        </Flex>
        <Spacer />
        <Box fontWeight={500} fontSize="14px">
          {detail?.created_at}
        </Box>
      </Flex>
      <Text fontWeight={700} fontSize="28px" textAlign="center">
        {detail?.subject || 'no subject'}
      </Text>
      <Box pt="30px">
        <RenderHTML
          html={detail?.content}
          attachments={[]}
          messageId=""
          from={{ name: '', address: '' }}
        />
      </Box>
      <Center>
        <Box
          as="button"
          mt="30px"
          fontWeight="400"
          fontSize="14px"
          lineHeight="21px"
          onClick={() => {
            console.log('unscription')
          }}
          color="#4E51F4"
        >
          unscription
        </Box>
      </Center>
    </Container>
  )
}
