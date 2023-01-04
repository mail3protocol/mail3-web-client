import { Box, Center, Flex, useBreakpointValue } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useMemo } from 'react'
import { useToast } from 'hooks'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { isEthAddress, isPrimitiveEthAddress, truncateMiddle } from 'shared'
import { APP_URL } from '../../constants/env'
import { useAPI } from '../../hooks/useAPI'

const CONTAINER_MAX_WIDTH = 1220

interface SubscriptionArticleBodyProps {
  mailAddress: string
  address: string
  uuid: string
  priAddress: string
  articleId: string
}

const PageContainer = styled(Box)`
  max-width: ${CONTAINER_MAX_WIDTH}px;
  margin: 20px auto;
  padding: 78px;
  min-height: 800px;
  background-color: #ffffff;

  @media (max-width: 600px) {
  }
`

export const SubscriptionArticleBody: React.FC<
  SubscriptionArticleBodyProps
> = ({ mailAddress, address, uuid, priAddress, articleId }) => {
  const [t] = useTranslation(['subscribe-profile', 'common'])
  const toast = useToast()
  const api = useAPI()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const shareUrl: string = useMemo(
    () => `${APP_URL}/p/${articleId}`,
    [articleId]
  )

  const { data: userInfo } = useQuery(
    ['userInfo', priAddress],
    async () => {
      const ret = await api.getSubscribeUserInfo(priAddress)
      return ret.data
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const { data: settings } = useQuery(
    ['userSetting', priAddress],
    async () => {
      const res = await api.getUserSetting(priAddress)
      return res.data
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const nickname = useMemo(() => {
    if (userInfo?.nickname) {
      return userInfo.nickname
    }
    if (isPrimitiveEthAddress(address)) {
      return truncateMiddle(address, 6, 4, '_')
    }
    if (isEthAddress(address)) {
      return address.includes('.') ? address.split('.')[0] : address
    }
    return ''
  }, [userInfo])

  console.log(userInfo, settings, nickname)

  return (
    <PageContainer>
      <Flex>
        <Center
          p="48px 32px"
          w="305px"
          flexDirection="column"
          border="1px solid rgba(0, 0, 0, 0.1)"
        >
          <p>{nickname}</p>
        </Center>
        <Box h="1000px">
          <p>{nickname}</p>
        </Box>
      </Flex>
    </PageContainer>
  )
}
