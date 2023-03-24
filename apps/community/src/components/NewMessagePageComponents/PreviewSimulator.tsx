import { Box, Flex, Heading, Text } from '@chakra-ui/react'

import React from 'react'
import { Preview } from '../Preview'
import { SubFormatDate } from '../../utils/date'

export interface PreviewSimulatorProps {
  html: string
  subject: string
  abstract?: string
}

export const PreviewSimulator: React.FC<PreviewSimulatorProps> = ({
  html,
  subject,
  abstract,
}) => (
  <Flex flex={1} direction="column">
    <Heading lineHeight="1.3" fontSize="32px" fontWeight="700">
      {subject}
    </Heading>
    <Flex mt="13px" align="center">
      <Box
        fontWeight={500}
        fontSize="14px"
        color="#6F6F6F"
        mt="4px"
        lineHeight="18px"
        h="32px"
      >
        {SubFormatDate(Date.now() / 1000, 'MMM D / h:mm A / YYYY')}
      </Box>
    </Flex>
    {abstract ? (
      <Box
        mt="13px"
        background="#EBEBEB"
        borderRadius="12px"
        p="15px"
        overflow="hidden"
      >
        <Text
          fontWeight={{ base: '400', md: '500' }}
          fontSize={{ base: '12px', md: '16px' }}
          lineHeight={{ base: '18px', md: '24px' }}
          color="#333333"
        >
          {abstract}
        </Text>
      </Box>
    ) : null}
    <Box pt="30px">
      <Preview html={html} />
    </Box>
  </Flex>
)
