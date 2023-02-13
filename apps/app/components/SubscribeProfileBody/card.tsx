import { Box, Flex, LinkBox, LinkOverlay, Spacer, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { ReactComponent as SvgTag } from 'assets/subscribe-page/premium-tag.svg'
import { HomeCommunity } from 'models'

const dateStringFormat = `h:mm a · D MMM`

export const CommunityCard: React.FC<{
  date?: string
  title: string
  content?: string
  uuid: string
  type: HomeCommunity.MessageType
}> = ({ date, title, content, uuid, type }) => {
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
      h={{ base: '178px', md: '192px' }}
    >
      <LinkOverlay href={`${location.origin}/p/${uuid}`} target="_blank">
        {type === HomeCommunity.MessageType.Premium ? (
          <Box position="absolute" right="0" bottom="0">
            <SvgTag />
          </Box>
        ) : null}
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
              noOfLines={{ base: 2, md: 3 }}
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
              mt={{ base: '16px', md: '6px' }}
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
