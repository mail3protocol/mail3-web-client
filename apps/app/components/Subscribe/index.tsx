import {
  Center,
  Heading,
  HStack,
  Image,
  Box,
  Text,
  Spinner,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
} from '@chakra-ui/react'
import { useAccount } from 'hooks'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { Button } from 'ui'
import { Query } from '../../api/query'
import Welcomepng from '../../assets/subscribe/welcome.png'
import { useAPI } from '../../hooks/useAPI'
import { useAuth, useIsAuthenticated } from '../../hooks/useLogin'
import { RoutePath } from '../../route/path'
import { ConnectModalWithMultichain } from '../ConnectWallet/ConnectModalWithMultichain'
import { useNotification } from '../../hooks/useNotification'

const ConnectWallet = () => {
  const [t] = useTranslation('subscribe')
  return (
    <Center mt="40px">
      <Center
        padding="32px"
        border="1px solid #efefef"
        borderRadius="24px"
        flexDirection="column"
      >
        <Heading mb="32px" fontSize="20px" fontWeight={700}>
          {t('connect')}
        </Heading>
        <HStack spacing="48px">
          <Center>
            <Image src={Welcomepng} w="191px" />
          </Center>
          <Box>
            <ConnectModalWithMultichain show isOpen onClose={() => {}} />
          </Box>
        </HStack>
      </Center>
    </Center>
  )
}

const AlreadySubscribed = () => {
  const [t] = useTranslation('subscribe')
  return (
    <Center h="calc(100vh - 180px)">
      <Center
        padding="32px"
        flexDirection="column"
        border="1px solid #efefef"
        borderRadius="24px"
      >
        <Heading mb="24px" fontSize="20px" fontWeight={700}>
          {t('already')}
        </Heading>
        <Text mb="24px">{t('visit')}</Text>
        <Link to={RoutePath.Inbox}>
          <Button w="168px">{t('continue')}</Button>
        </Link>
      </Center>
    </Center>
  )
}

const Desc: React.FC = ({ children }) => (
  <Box
    textAlign="center"
    padding="8px"
    bg="#F3F3F3"
    borderRadius="16px"
    mb="16px"
    mt="8px"
    fontSize="12px"
  >
    {children}
  </Box>
)

const SubscribeStatus = () => {
  const {
    isBrowserSupport,
    webPushNotificationState,
    permission,
    requestPermission,
  } = useNotification(false)
  const [t] = useTranslation('subscribe')
  const isEnabledNotification =
    permission === 'granted' && webPushNotificationState === 'enabled'
  const [isSubscribed, setIsSubscribe] = useState(isEnabledNotification)
  if (!isBrowserSupport || isSubscribed) {
    return (
      <>
        <Text fontWeight={700} fontSize="14px">
          {t('nft')}
        </Text>
        <Desc>{t('success')}</Desc>
        <Link to={RoutePath.Inbox}>
          <Button w="168px">{t('continue')}</Button>
        </Link>
      </>
    )
  }

  if (permission === 'denied') {
    return (
      <>
        <Text fontWeight={700} mb="16px">
          {t('declined')}
        </Text>
        <Link to={RoutePath.Inbox}>
          <Button w="168px">{t('continue')}</Button>
        </Link>
      </>
    )
  }

  return (
    <>
      <Text fontWeight={700} fontSize="14px">
        {t('nft')}
      </Text>
      <Desc>
        <Trans
          components={{
            b: <Text color="blue" />,
          }}
          ns="subscribe"
          i18nKey="request-permission"
          t={t}
        />
      </Desc>
      <Button
        w="168px"
        onClick={async () => {
          const ps = await requestPermission()
          if (ps === 'granted') {
            setIsSubscribe(true)
          }
        }}
      >
        {t('ok')}
      </Button>
    </>
  )
}

const Subscribing = () => {
  const [t] = useTranslation('subscribe')
  return (
    <Center h="calc(100vh - 180px)" textAlign="center">
      <Center
        padding="32px"
        flexDirection="column"
        w="375px"
        border="1px solid #efefef"
        borderRadius="24px"
      >
        <Heading mb="24px" fontSize="20px" fontWeight={700}>
          {t('subscribed')}
        </Heading>
        <Image src={Welcomepng} w="180px" mb="24px" />
        <SubscribeStatus />
      </Center>
    </Center>
  )
}

export const Subscribe: React.FC = () => {
  useAuth()
  const isAuth = useIsAuthenticated()
  const acccount = useAccount()
  const api = useAPI()
  const { id } = useParams()
  const {
    isLoading: isLoadingStatus,
    data: subscribeStatus,
    error: getSubscribeStatusError,
  } = useQuery(
    [Query.GetSubscribeStatus, acccount, id],
    async () => {
      const r = await api.getSubscribeStatus(id!)
      return r.data
    },
    {
      enabled: !!id && isAuth,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const {
    isLoading: isSubscribing,
    data: subscribeResult,
    error: putSubscribeError,
  } = useQuery(
    [Query.GetSubscribeStatus, acccount, id],
    async () => {
      const { data } = await api.putSubscribeCampaign(id!)
      // console.log(data)
      return data
    },
    {
      enabled: !!id && isAuth && subscribeStatus?.state === 'inactive',
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  if (!isAuth) {
    return <ConnectWallet />
  }

  if (isSubscribing || isLoadingStatus) {
    return (
      <Center mt="50px">
        <Spinner size="lg" />
      </Center>
    )
  }

  if (subscribeStatus?.state === 'active') {
    return <AlreadySubscribed />
  }

  // TODO: or already subscribed
  if (subscribeResult) {
    return <Subscribing />
  }

  // @ts-ignore
  const error = getSubscribeStatusError?.message ?? putSubscribeError?.message
  return (
    <Alert status="error" backgroundColor="#FFE2E2" borderRadius="6px">
      <AlertIcon />
      <Box color="#DA4444">
        <AlertTitle fontSize="14px">Error:</AlertTitle>
        <AlertDescription fontSize="12px">{error}</AlertDescription>
      </Box>
    </Alert>
  )
}
