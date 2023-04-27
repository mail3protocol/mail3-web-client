import {
  Box,
  Center,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { ReactComponent as SvgDiamond } from 'assets/subscribe-page/diamond.svg'
import { HomeCommunity } from 'models'
import { useTranslation } from 'react-i18next'

const dateStringFormat = `h:mm a · D MMM · YYYY`

export const CommunityCard: React.FC<{
  date?: string
  title: string
  content?: string
  uuid: string
  type: HomeCommunity.MessageType
}> = ({ date, title, content, uuid, type }) => {
  const [t] = useTranslation(['subscribe-profile', 'common'])
  const formatDayjs = dayjs(Number(date) * 1000)
  const time = formatDayjs.format(dateStringFormat)

  return (
    <LinkBox as="article" borderBottom="1px solid #D9D9D9" p="24px 0">
      <LinkOverlay href={`${location.origin}/p/${uuid}`} target="_blank">
        <Flex
          fontWeight="400"
          fontSize="12px"
          lineHeight="20px"
          color="#6F6F6F"
          mb="4px"
        >
          {time}
          {type === HomeCommunity.MessageType.Premium ? (
            <Flex ml="4px" alignItems="center">
              <Icon as={SvgDiamond} w="14px" h="14px" />
              <Box
                ml="2px"
                fontStyle="italic"
                fontWeight="600"
                fontSize="12px"
                lineHeight="14px"
                color="#FFA800"
              >
                {t('premium-only')}
              </Box>
            </Flex>
          ) : null}
        </Flex>

        <Flex mt="16px">
          <Box w="calc(100% - 368px)">
            <Text
              noOfLines={2}
              fontWeight="700"
              fontSize="24px"
              lineHeight="32px"
            >
              {title}
            </Text>
            <Text
              noOfLines={3}
              fontWeight="400"
              fontSize="16px"
              lineHeight="24px"
              mt="16px"
            >
              {content}
            </Text>
          </Box>
          <Spacer />
          <Center pr="24px">
            <Box w="272px" h="152px" bgColor="#ccc" />
          </Center>
        </Flex>
      </LinkOverlay>
    </LinkBox>
  )
}
