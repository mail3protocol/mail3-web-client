import { Box, Divider, Flex, Heading } from '@chakra-ui/react'
import { Avatar } from 'ui'
import React from 'react'
import { useAccount } from 'hooks'
import { Preview } from '../Preview'

export interface PreviewSimulatorProps {
  html: string
  subject: string
}

export const PreviewSimulator: React.FC<PreviewSimulatorProps> = ({
  html,
  subject,
}) => {
  const address = useAccount()
  return (
    <Flex flex={1} direction="column" px="50px">
      <Flex align="center">
        <Avatar w="32px" h="32px" address={address} />
        <Box fontSize="14px" lineHeight="26px" fontWeight="600" ml="6px">
          User Name
        </Box>
      </Flex>
      <Box
        color="previewDatetimeColor"
        lineHeight="26px"
        fontSize="12px"
        fontWeight="500"
      >
        Aug 27 9:07 am
      </Box>
      <Divider as="hr" mt="20px" />
      <Heading
        lineHeight="32px"
        fontSize="28px"
        fontWeight="700"
        mt="20px"
        mb="12px"
        textAlign="center"
      >
        {subject}
      </Heading>
      <Preview html={html} />
    </Flex>
  )
}
