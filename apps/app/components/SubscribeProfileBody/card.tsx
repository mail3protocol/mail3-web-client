import { Box, Flex, LinkBox, LinkOverlay, Spacer, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'

const dateStringFormat = `h:mm a · D MMM`

export const CommunityCard: React.FC<{
  date?: string
  title: string
  content?: string
  uuid: string
}> = ({ date, title, content, uuid }) => {
  const formatDayjs = dayjs(Number(date) * 1000)
  const year = formatDayjs.year()
  const day = formatDayjs.format(dateStringFormat)

  return (
    <LinkBox
      as="article"
      border="1px solid #EAEAEA"
      borderRadius="16px"
      p="16px"
      mb={{ base: '13px', md: 0 }}
      h="192px"
    >
      <LinkOverlay href={`${location.origin}/p/${uuid}`} target="_blank">
        <Flex
          fontWeight="400"
          fontSize="12px"
          lineHeight="26px"
          color="#6F6F6F"
          mb="4px"
        >
          <Box>{day}</Box>
          <Spacer />
          <Box>{year}</Box>
        </Flex>
        {content ? (
          <Box>
            <Text
              noOfLines={3}
              fontWeight="700"
              fontSize="18px"
              lineHeight="24px"
            >
              {title}
            </Text>
            <Text
              noOfLines={3}
              fontWeight="400"
              fontSize="12px"
              lineHeight="18px"
              mt="6px"
            >
              {content}
            </Text>
          </Box>
        ) : (
          <Text noOfLines={3} fontWeight="700" fontSize="24px" lineHeight="1.5">
            {title}
          </Text>
        )}
      </LinkOverlay>
    </LinkBox>
  )
}
