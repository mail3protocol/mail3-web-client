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
import { atom, useAtom, useAtomValue } from 'jotai'
import { ConnectWalletSelector } from 'connect-wallet/src/ConnectModalWithMultichain'
import styled from '@emotion/styled'
import { RewardType } from 'models'
import { Query } from '../../api/query'
import WelcomePng from '../../assets/subscribe/welcome.png'
import SubscribePng from '../../assets/subscribe/subscribe.png'
import GuideMp4 from '../../assets/subscribe/guide-claim.mp4'
import AirAllowPng from '../../assets/subscribe/allow-air.png'
import HappyPng from '../../assets/subscribe/happy.png'
import { useAPI } from '../../hooks/useAPI'
import { useAuth, useIsAuthenticated } from '../../hooks/useLogin'
import { RoutePath } from '../../route/path'
import { useNotification } from '../../hooks/useNotification'
import { ConnectWalletApiContextProvider } from '../ConnectWallet'
import { IS_MOBILE } from '../../constants'
import confettiAni from './confetti'
import { rewardTypeAtom } from '../../pages/subscribe'

export interface SubscribeProps {
  rewardType?: RewardType
  isDialog?: boolean
  uuid?: string
}

const useTrackContinue = () => useTrackClick(TrackEvent.ClickSubscribeVisit)
const useTrackContinueAir = () =>
  useTrackClick(TrackEvent.ClickSubscribeAirVisit)

const useTrackOk = () => useTrackClick(TrackEvent.ClickSubscribeOk)
const useTrackAirOk = () => useTrackClick(TrackEvent.ClickSubscribeAirOk)

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

const NewHeading = styled(Heading)`
  background: linear-gradient(
    90.02deg,
    #ffb1b1 0.01%,
    #ffcd4b 50.26%,
    #916bff 99.99%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`

const atomWaitPermission = atom(true)

const ConnectWallet = () => {
  const Comp = IS_MOBILE ? VStack : HStack
  const rewardType = useAtomValue(rewardTypeAtom)
  return (
    <ConnectWalletApiContextProvider>
      <Center mt="20px">
        <Center
          padding="32px"
          border="1px solid #efefef"
          borderRadius="24px"
          flexDirection="column"
        >
          <Comp spacing="48px">
            {rewardType !== RewardType.AIR ? (
              <ScanAnimate w="191px">
                <Image src={WelcomePng} w="191px" />
                <Box className="light" />
              </ScanAnimate>
            ) : null}
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
    <Center p="20px 0">
      <Flex flexDir="column" width={{ base: '300px', md: '400px' }}>
        <Steps
          labelOrientation="vertical"
          activeStep={activeStep}
          size="sm"
          responsive={false}
        >
          {steps.map(({ label }) => (
            <Step description={label} key={label} />
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
  const rewardType = useAtomValue(rewardTypeAtom)
  const trackContinue = useTrackContinue()
  const trackContinueAir = useTrackContinueAir()

  return (
    <Center h="calc(100vh - 180px)">
      <Center
        padding="32px"
        flexDirection="column"
        borderRadius="24px"
        boxShadow="0px 0px 8px rgba(78, 81, 244, 0.2)"
      >
        <Center
          mb="24px"
          fontSize={{ base: '22px', md: '24px' }}
          lineHeight="36px"
          fontWeight={900}
        >
          🎉
          <NewHeading
            fontSize={{ base: '18px', md: '24px' }}
            lineHeight="36px"
            fontWeight={900}
          >
            {t('thank-you')}
          </NewHeading>
        </Center>

        <Text
          mb="24px"
          fontWeight="600"
          fontSize={{ base: '14px', md: '16px' }}
          lineHeight="24px"
        >
          {t('visit')}
        </Text>

        <Image src={HappyPng} />

        <Link to={RoutePath.Inbox}>
          <Button
            background="#4E51F4"
            _hover={{
              bg: '#4E51E0',
            }}
            mt="24px"
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
              const status = state === 'resubscribed' ? repeat : already
              if (rewardType === RewardType.AIR) {
                trackContinueAir({
                  [TrackKey.SubscribeBtnAirStatus]: status,
                })
              } else {
                trackContinue({
                  [TrackKey.SubscribeBtnStatus]: status,
                })
              }
            }}
          >
            {t('visit-button')}
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
            {t('open-inbox')}
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
          {t('open-inbox')}
        </Button>
      </Link>
    </>
  )
}

const Subscribing: React.FC = () => {
  const [t] = useTranslation('subscribe')
  const [isWaitPermission, setIsWaitPermission] = useAtom(atomWaitPermission)
  const {
    isBrowserSupport,
    permission,
    requestPermission,
    isBrowserSupportChecking,
  } = useNotification(false)
  const [isDeclined, setIsDeclined] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const trackOK = useTrackOk()

  useEffect(() => {
    if (permission === 'granted' && !isDeclined && !isWaitPermission) {
      confettiAni()?.cleanup()
    }
  }, [permission, isDeclined, isWaitPermission])

  if (isBrowserSupportChecking) {
    return null
  }

  const activeStep = isWaitPermission && isBrowserSupport ? 1 : 2

  return (
    <Center h="calc(100vh - 180px)" textAlign="center">
      <Center padding="0 32px" flexDirection="column">
        <Heading
          mb="24px"
          fontSize={{ base: '22px', md: '28px' }}
          lineHeight="42px"
          fontWeight={700}
        >
          {t('subscribed')}
        </Heading>

        <StepsWrap initialStep={activeStep} key={activeStep} />

        {(isWaitPermission && isBrowserSupport && permission === 'default') ||
        isRequesting ? (
          <>
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
              <Flex justifyContent="center">
                <Trans
                  components={{
                    b: <Text color="#4E51F4" p="0 2px" />,
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
            <ScanAnimate w="180px">
              <Image src={SubscribePng} w="180px" mb="24px" />
              <Box className="light" />
            </ScanAnimate>
            <SubscribeStatus
              isBrowserSupport={isBrowserSupport}
              isDeclined={isDeclined}
              permission={permission}
            />
          </>
        )}
      </Center>
    </Center>
  )
}

const SubscribingAir: React.FC = () => {
  const [t] = useTranslation('subscribe')
  const [isWaitPermission, setIsWaitPermission] = useAtom(atomWaitPermission)
  const {
    isBrowserSupport,
    permission,
    requestPermission,
    isBrowserSupportChecking,
  } = useNotification(false)

  const [isRequesting, setIsRequesting] = useState(false)
  const trackOK = useTrackAirOk()
  const trackContinueAir = useTrackContinueAir()
  const [isDeclined, setIsDeclined] = useState(false)

  if (isBrowserSupportChecking) {
    return null
  }

  return (
    <Center h="calc(100vh - 180px)" textAlign="center">
      <Center
        padding="32px"
        flexDirection="column"
        w="438px"
        border="2px solid #F2F2F2"
        boxShadow="0px 0px 8px rgba(78, 81, 244, 0.2)"
        borderRadius="24px"
      >
        <Center
          mb="24px"
          fontSize={{ base: '22px', md: '24px' }}
          lineHeight="36px"
          fontWeight={900}
        >
          🎉
          <NewHeading
            fontSize={{ base: '18px', md: '24px' }}
            lineHeight="36px"
            fontWeight={900}
          >
            {t('thank-you')}
          </NewHeading>
        </Center>

        {(isWaitPermission && isBrowserSupport && permission === 'default') ||
        isRequesting ? (
          <>
            <Text
              fontWeight="600"
              fontSize={{ base: '14px', md: '16px' }}
              lineHeight="24px"
            >
              <Trans
                components={{
                  b: <Box as="span" color="#4E51F4" p="0 2px" />,
                }}
                ns="subscribe"
                i18nKey="allow-notification"
                t={t}
              />
            </Text>
            <Center>
              <Image src={AirAllowPng} />
            </Center>
            <Center mt="16px">
              <Button
                w="175px"
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
                {t('continue')}
              </Button>
            </Center>
          </>
        ) : (
          <>
            <Text
              fontWeight="600"
              fontSize={{ base: '14px', md: '16px' }}
              lineHeight="24px"
            >
              {t('visit')}
            </Text>
            <Image src={HappyPng} m="20px 0" />
            <Center mt="16px">
              <Link to={RoutePath.Inbox}>
                <Button
                  w="168px"
                  background="#4E51F4"
                  _hover={{
                    bg: '#4E51E0',
                  }}
                  onClick={() => {
                    const status = IS_MOBILE
                      ? SubscribeAction.Mobile
                      : SubscribeAction.Already

                    trackContinueAir({
                      [TrackKey.SubscribeBtnAirStatus]: isDeclined
                        ? SubscribeAction.Denial
                        : status,
                    })
                  }}
                >
                  {t('visit-button')}
                </Button>
              </Link>
            </Center>
          </>
        )}
      </Center>
    </Center>
  )
}

export const Subscribe: React.FC<SubscribeProps> = ({ uuid }) => {
  const [t] = useTranslation('subscribe')
  useAuth()
  const isAuth = useIsAuthenticated()
  const account = useAccount()
  const api = useAPI()
  const { id: urlId } = useParams()
  const id = uuid || urlId
  const rewardType = useAtomValue(rewardTypeAtom)
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
          const oldMsg = s?.account || {}
          const newStatus = {
            ...s,
            [account]: {
              ...oldMsg,
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
        <Center fontWeight="700" fontSize="28px" lineHeight="42px" m="30px 0">
          {rewardType !== RewardType.AIR ? t('connect') : t('connect-air')}
        </Center>

        {rewardType !== RewardType.AIR ? <StepsWrap initialStep={0} /> : null}

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

  // use to dev
  // if (
  //   subscribeStatus?.state === 'active' ||
  //   subscribeResult?.state === 'resubscribed'
  // ) {
  //   return <Subscribing />
  // }
  console.log('subscribeStatus', subscribeStatus)
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
    if (rewardType === RewardType.AIR) return <SubscribingAir />
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
