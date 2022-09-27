import {
  Center,
  Heading,
  HStack,
  Image,
  Box,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { useAccount } from 'hooks'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
    <Center>
      <Center padding="32px" flexDirection="column">
        <Heading mb="24px" fontSize="20px" fontWeight={700}>
          {t('already')}
        </Heading>
        <Text mb="24px">{t('vista')}</Text>
        <Link to={RoutePath.Inbox}>
          <Button w="168px">{t('continue')}</Button>
        </Link>
      </Center>
    </Center>
  )
}

const Desc: React.FC = ({ children }) => {
  return <Box textAlign="center" padding="8px" bg="#F3F3F3" borderRadius="16px">
    {children}
  </Box>
}

const SubscribeStatus = () => {
  const { isBrowserSupport, webPushNotificationState, permission } = useNotification(false)
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
        <Text mb="24px">{t('vista')}</Text>
        <Desc>{t('success')}</Desc>
        <Link to={RoutePath.Inbox}>
          <Button w="168px">{t('continue')}</Button>
        </Link>
      </>
    )
  }

  if (permission === 'denied') {

  }

  return (

  )
}

const Subscribing = () => {
  const [t] = useTranslation('subscribe')
  return (
    <Center>
      <Center padding="32px" flexDirection="column" minW="375px">
        <Heading mb="24px" fontSize="20px" fontWeight={700}>
          {t('subscribed')}
        </Heading>
        <Image src={Welcomepng} w="180px" mb="24px" />
        <Text fontWeight={700} fontSize="14px">
          {t('nft')}
        </Text>
        <Text mb="24px">{t('vista')}</Text>
        <Link to={RoutePath.Inbox}>
          <Button w="168px">{t('continue')}</Button>
        </Link>
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
  const { isLoading: isLoadingStatus, data: subscribeStatus } = useQuery(
    [Query.GetSubscribeStatus, acccount, id],
    async () => {
      const { data } = await api.getSubscribeStatus(id!)
      return data
    },
    {
      enabled: !!id && isAuth,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const { isLoading: isSubscribing, data: subscribeResult } = useQuery(
    [Query.GetSubscribeStatus, acccount, id],
    async () => {
      const { data } = await api.putSubscribeCampaign(id!)
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
      <Center>
        <Spinner size="xl" />
      </Center>
    )
  }

  if (subscribeStatus?.state === 'active') {
    return <AlreadySubscribed />
  }

  if (subscribeResult) {
    return <Subscribing />
  }

  return <div>connect</div>
}
