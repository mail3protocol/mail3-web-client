import {
  Box,
  Center,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
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
  const isHasImage = false

  return (
    <LinkBox
      as="article"
      borderBottom="1px solid #D9D9D9"
      p={{ base: '13px 0 16px', md: '24px 0' }}
    >
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
          <Box w="100%">
            <Text
              noOfLines={2}
              fontWeight="700"
              fontSize={{ base: '16px', md: '24px' }}
              lineHeight={{ base: '20px', md: '32px' }}
            >
              {title}
            </Text>
            <Text
              noOfLines={2}
              fontWeight="400"
              fontSize={{ base: '12px', md: '16px' }}
              lineHeight={{ base: '20px', md: '24px' }}
              mt={{ base: '8px', md: '16px' }}
            >
              {content}
            </Text>
          </Box>
          {isHasImage ? (
            <Center
              pr={{ base: '0', md: '24px' }}
              alignItems={{ base: 'flex-start', md: 'center' }}
            >
              <Box
                w={{ base: '60px', md: '272px' }}
                h={{ base: '60px', md: '152px' }}
                bgColor="#ccc"
              />
            </Center>
          ) : null}
        </Flex>
      </LinkOverlay>
    </LinkBox>
  )
}
