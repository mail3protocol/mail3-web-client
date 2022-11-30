import {
  Center,
  Heading,
  Image,
  Box,
  Text,
  Spinner,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  VStack,
  HStack,
  Flex,
} from '@chakra-ui/react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import {
  SubscribeAction,
  TrackEvent,
  TrackKey,
  useAccount,
  useTrackClick,
} from 'hooks'
import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { Button } from 'ui'
import { atomWithStorage } from 'jotai/utils'
import { atom, useAtom } from 'jotai'
import { ConnectWalletSelector } from 'connect-wallet/src/ConnectModalWithMultichain'
import styled from '@emotion/styled'
import { Query } from '../../api/query'
import WelcomePng from '../../assets/subscribe/welcome.png'
import SubscribePng from '../../assets/subscribe/subscribe.png'
import GuideMp4 from '../../assets/subscribe/guide-claim.mp4'
import { useAPI } from '../../hooks/useAPI'
import { useAuth, useIsAuthenticated } from '../../hooks/useLogin'
import { RoutePath } from '../../route/path'
import { useNotification } from '../../hooks/useNotification'
import { ConnectWalletApiContextProvider } from '../ConnectWallet'
import { IS_MOBILE } from '../../constants'
import start from './confetti'

const useTrackContinue = () => useTrackClick(TrackEvent.ClickSubscribeVisit)

const useTrackOk = () => useTrackClick(TrackEvent.ClickSubscribeOk)

const ScanAnimate = styled(Center)`
  overflow: hidden;
  position: relative;

  .light {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    width: 200%;
    height: 100px;

    /* linear-gradient() make a light */
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 0)
    );

    /* rotate light */
    transform-origin: center center;
    transform: translate(-100%, 50%) rotate(-60deg);

    /* keyframes animation */
    animation: ScanLights 4s linear 2s infinite;
  }

  @keyframes ScanLights {
    0% {
      transform: translate(-200%, 50%) rotate(-60deg);
    }
    100% {
      transform: translate(200%, 50%) rotate(-60deg);
    }
  }
`

const atomWaitPermission = atom(false)

const ConnectWallet = () => {
  const Comp = IS_MOBILE ? VStack : HStack
  return (
    <ConnectWalletApiContextProvider>
      <Center mt="40px">
        <Center
          padding="32px"
          border="1px solid #efefef"
          borderRadius="24px"
          flexDirection="column"
        >
          <Comp spacing="48px">
            <ScanAnimate w="191px">
              <Image src={WelcomePng} w="191px" />
              <Box className="light" />
            </ScanAnimate>
            <Box>
              <ConnectWalletSelector />
            </Box>
          </Comp>
        </Center>
      </Center>
    </ConnectWalletApiContextProvider>
  )
}

const StepsWrap: React.FC<{ initialStep: number }> = ({ initialStep }) => {
  const [t] = useTranslation('subscribe')
  const steps = [{ label: t('steps.one') }, { label: t('steps.two') }]

  const { activeStep } = useSteps({
    initialStep,
  })

  return (
    <Center p="30px 0">
      <Flex flexDir="column" width="400px">
        <Steps labelOrientation="vertical" activeStep={activeStep}>
          {steps.map(({ label }) => (
            <Step label={label} key={label} />
          ))}
        </Steps>
      </Flex>
    </Center>
  )
}

const AlreadySubscribed: React.FC<{ state: 'active' | 'resubscribed' }> = ({
  state,
}) => {
  const [t] = useTranslation('subscribe')
  const trackContinue = useTrackContinue()
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
            onClick={() => {
              const repeat = IS_MOBILE
                ? SubscribeAction.MobileRepeat
                : SubscribeAction.Repeat
              const already = IS_MOBILE
                ? SubscribeAction.Mobile
                : SubscribeAction.Already
              trackContinue({
                [TrackKey.SubscribeBtnStatus]:
                  state === 'resubscribed' ? repeat : already,
              })
            }}
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

const SubscribeStatus: React.FC<{
  permission: 'default' | 'denied' | 'granted' | 'prompt'
  isBrowserSupport?: boolean
  isDeclined: boolean
}> = ({ permission, isBrowserSupport, isDeclined }) => {
  const [t] = useTranslation('subscribe')

  const trackContinue = useTrackContinue()
  if (permission === 'default' && isBrowserSupport) {
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
        <Button w="168px">{t('ok')}</Button>
      </>
    )
  }

  if (isDeclined) {
    return (
      <>
        <Text
          mb="16px"
          whiteSpace="pre-line"
          w="283px"
          fontWeight="700"
          fontSize="14px"
          lineHeight="18px"
        >
          {t('declined')}
        </Text>
        <Link to={RoutePath.Inbox}>
          <Button
            w="168px"
            onClick={() => {
              trackContinue({
                [TrackKey.SubscribeBtnStatus]: SubscribeAction.Denial,
              })
            }}
          >
            {t('continue')}
          </Button>
        </Link>
      </>
    )
  }

  return (
    <>
      <Text fontWeight={700} fontSize="20px" lineHeight="30px">
        {t('nft')}
      </Text>
      <Text
        w="283px"
        color="#4E51F4"
        fontWeight="700"
        fontSize="14px"
        lineHeight="18px"
        m="20px 0"
      >
        {t('success')}
      </Text>
      <Link to={RoutePath.Inbox}>
        <Button
          w="168px"
          onClick={() => {
            trackContinue({
              [TrackKey.SubscribeBtnStatus]: IS_MOBILE
                ? SubscribeAction.Mobile
                : SubscribeAction.Already,
            })
          }}
        >
          {t('continue')}
        </Button>
      </Link>
    </>
  )
}

const Subscribing: React.FC = () => {
  const [t] = useTranslation('subscribe')
  const [isWaitPermission, setIsWaitPermission] = useAtom(atomWaitPermission)
  const { isBrowserSupport, permission, requestPermission } =
    useNotification(false)
  const [isDeclined, setIsDeclined] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const trackOK = useTrackOk()

  useEffect(() => {
    console.log(permission, isDeclined, isWaitPermission)
    if (permission === 'granted' && !isDeclined && !isWaitPermission) {
      start()
    }
  }, [permission, isDeclined, isWaitPermission])

  return (
    <Center h="calc(100vh - 180px)" textAlign="center">
      <Center padding="0 32px" flexDirection="column">
        <Heading mb="24px" fontSize="28px" lineHeight="42px" fontWeight={700}>
          {t('subscribed')}
        </Heading>

        {(isWaitPermission && isBrowserSupport) || isRequesting ? (
          <>
            <StepsWrap initialStep={1} />
            <Center
              w="600px"
              h="255px"
              mt="25px"
              mb="15px"
              background="#FFFFFF"
              border="1px solid rgba(0, 0, 0, 0.2)"
              borderRadius="48px"
              justifyContent="center"
            >
              <video width="320" height="208" autoPlay loop muted>
                <source src={GuideMp4} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Center>
            <Box
              textAlign="center"
              fontWeight="500"
              fontSize="16px"
              lineHeight="24px"
            >
              <Flex>
                <Trans
                  components={{
                    b: <Text color="blue" p="0 2px" />,
                  }}
                  ns="subscribe"
                  i18nKey="claim-p1"
                  t={t}
                />
              </Flex>
              <Text>{t('claim-p2')}</Text>
            </Box>
            <Center mt="16px">
              <Button
                w="175px"
                background="#4E51F4"
                _hover={{
                  bg: '#4E51E0',
                }}
                isLoading={isRequesting}
                onClick={async () => {
                  setIsRequesting(true)
                  trackOK()
                  try {
                    const ps = await requestPermission()
                    if (ps === 'denied') {
                      setIsDeclined(true)
                    }
                  } catch (error) {
                    //
                  } finally {
                    setIsRequesting(false)
                    setIsWaitPermission(false)
                  }
                }}
              >
                🎁 Claim !
              </Button>
            </Center>
          </>
        ) : (
          <>
            <StepsWrap initialStep={2} />
            <ScanAnimate w="180px">
              <Image src={SubscribePng} w="180px" mb="24px" />
              <Box className="light" />
            </ScanAnimate>
            <SubscribeStatus
              isBrowserSupport
              isDeclined={false}
              permission="granted"
            />
            {/* <SubscribeStatus
            isBrowserSupport={isBrowserSupport}
            isDeclined={isDeclined}
            permission={permission}
          /> */}
          </>
        )}
      </Center>
    </Center>
  )
}

export const Subscribe: React.FC = () => {
  const [t] = useTranslation('subscribe')
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
        setLocalSubscribeStatus((s) => {
          const newStatus = {
            ...s,
            [account]: {
              ...s[account],
              [id!]: true,
            },
          }
          return newStatus
        })
      },
    }
  )

  if (!isAuth) {
    return (
      <Box>
        <Center
          fontWeight="700"
          fontSize="28px"
          lineHeight="42px"
          marginBottom="35px"
        >
          {t('connect')}
        </Center>

        <StepsWrap initialStep={0} />
        <ConnectWallet />
      </Box>
    )
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
    return <Subscribing />
  }

  if (
    subscribeStatus?.state === 'active' ||
    subscribeResult?.state === 'resubscribed'
  ) {
    return <AlreadySubscribed state={subscribeResult?.state} />
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
