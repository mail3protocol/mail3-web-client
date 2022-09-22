import { Avatar, Box, Flex, Spacer, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { atom, useAtomValue } from 'jotai'
import React, { useEffect } from 'react'
import { RenderHTML } from '../Preview/parser'

export const SubPreviewIdAtom = atom(null)

const Container = styled(Box)`
  flex: 2;
  height: 100%;
  padding: 55px;
  overflow: hidden;
  overflow-y: scroll;
`

export const SubPreview: React.FC = () => {
  const id = useAtomValue(SubPreviewIdAtom)

  // useQuery [id]
  const mock = {
    uuid: 'string',
    subject: 'string',
    writer_name: 'string',
    writer_uuid: 'string',
    content: 'string',
    created_at: 'string',
  }

  useEffect(() => {
    console.log('preview', id)
  }, [id])

  // loading

  // empty

  // content (parse html)

  return (
    <Container>
      <Flex w="100%" align="center">
        <Flex align="center">
          <Avatar w="43px" h="43px" />
          <Box ml="15px" fontWeight={600} fontSize="14px">
            123
          </Box>
        </Flex>
        <Spacer />
        <Box fontWeight={500} fontSize="14px">
          Aug 27 / 9:07 am{' '}
        </Box>
      </Flex>
      <Text fontWeight={700} fontSize="28px" textAlign="center">
        The More Important the Work, the More Important the Rest
      </Text>
      <RenderHTML
        html="content"
        attachments={[]}
        messageId=""
        from={{ name: '', address: '' }}
      />
    </Container>
  )
}
