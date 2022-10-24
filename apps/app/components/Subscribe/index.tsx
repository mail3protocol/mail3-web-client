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
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import { Query } from '../../api/query'
import Welcomepng from '../../assets/subscribe/welcome.png'
import { useAPI } from '../../hooks/useAPI'
import { useAuth, useIsAuthenticated } from '../../hooks/useLogin'
import { RoutePath } from '../../route/path'
import { useNotification } from '../../hooks/useNotification'
import {
  ConnectWalletApiContextProvider,
  ConnectModalWithMultichain,
} from '../ConnectWallet'

const ConnectWallet = () => {
  const [t] = useTranslation('subscribe')
  return (
    <ConnectWalletApiContextProvider>
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
    </ConnectWalletApiContextProvider>
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
        <Heading mb="24px" fontSize={['14px', '20px', '20px']} fontWeight={700}>
          {t('thank-you')}
        </Heading>
        <Text mb="24px" fontSize={['12px']}>
          {t('visit')}
        </Text>
        <Link to={RoutePath.Inbox}>
          <Button
            w={['138px', '168px', '168px']}
            h={['40px']}
            fontSize={['14px']}
          >
            {t('continue')}
          </Button>
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
    whiteSpace="pre"
  >
    {children}
  </Box>
)

const localSubscribeStatusAtom = atomWithStorage<
  Record<string, Record<string, boolean>>
>('subscribeStatus', {})

const SubscribeStatus = () => {
  const { isBrowserSupport, permission, requestPermission } =
    useNotification(false)
  const [t] = useTranslation('subscribe')
  const [isDeclined, setIsDeclined] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  if ((permission === 'default' && isBrowserSupport) || isRequesting) {
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
          isLoading={isRequesting}
          onClick={async () => {
            setIsRequesting(true)
            try {
              const ps = await requestPermission()
              if (ps === 'denied') {
                setIsDeclined(true)
              }
            } catch (error) {
              //
            } finally {
              setIsRequesting(false)
            }
          }}
        >
          {t('ok')}
        </Button>
      </>
    )
  }

  if (isDeclined) {
    return (
      <>
        <Text fontWeight={700} mb="16px" whiteSpace="pre-line">
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
      <Desc>{t('success')}</Desc>
      <Link to={RoutePath.Inbox}>
        <Button w="168px">{t('continue')}</Button>
      </Link>
    </>
  )
}

const Subscribing: React.FC = () => {
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
  const account = useAccount()
  const api = useAPI()
  const { id } = useParams()
  const [localSubscribeStatus, setLocalSubscribeStatus] = useAtom(
    localSubscribeStatusAtom
  )
  const currentLocalSubscribeStatus =
    localSubscribeStatus?.[account]?.[id ?? ''] ?? false
  const {
    isLoading: isLoadingStatus,
    data: subscribeStatus,
    error: getSubscribeStatusError,
  } = useQuery(
    [Query.GetSubscribeStatus, account, id],
    async () => {
      try {
        await api.getSubscribeStatus(id!)
        return {
          state: 'active',
        } as any
      } catch (error: any) {
        if (
          error?.response?.status === 404 &&
          error?.response?.data?.reason === 'COMMUNITY_USER_FOLLOWING_NOT_FOUND'
        ) {
          return {
            state: 'inactive',
          } as any
        }
        throw error
      }
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
    [Query.SetSubscribeStatus, account, id],
    async () => {
      await api.putSubscribeCampaign(id!)
      if (currentLocalSubscribeStatus) {
        return {
          state: 'resubscribed',
        } as any
      }
      return {
        state: 'active',
      } as any
    },
    {
      enabled: !!id && isAuth && subscribeStatus?.state === 'inactive',
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess() {
        setLocalSubscribeStatus((s) => ({
          [account]: {
            ...s[account],
            [id!]: true,
          },
          ...s,
        }))
      },
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

  if (
    subscribeStatus?.state === 'active' ||
    subscribeResult?.state === 'resubscribed'
  ) {
    return <AlreadySubscribed />
  }
  const error =
    // @ts-ignore
    getSubscribeStatusError?.response?.data.message ??
    // @ts-ignore
    putSubscribeError?.response?.data.message
  // TODO: or already subscribed
  if (subscribeResult && !error) {
    return <Subscribing />
  }

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
