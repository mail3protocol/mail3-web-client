import React, { useMemo } from 'react'
import { Box, BoxProps, Button, ButtonProps, Center } from '@chakra-ui/react'
import { useAccount } from 'hooks'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { RewardType } from 'models'
import { useAPI } from '../../hooks/useAPI'
import { useAuth, useIsAuthenticated } from '../../hooks/useLogin'

enum SubscribeState {
  Active,
  Inactive,
}

export const SubscribeButton = () => {
  useAuth()
  const isAuth = useIsAuthenticated()

  const [searchParams] = useSearchParams()

  const uuid = searchParams.get('uuid')
  const rewardType = searchParams.get('rewardType')
  const urlRedirect = searchParams.get('redirect')
  const urlButtonStyle = searchParams.get('buttonStyle')
  const urlEarnIconStyle = searchParams.get('earnIconStyle')

  const redirect = useMemo(
    () => (urlRedirect ? decodeURIComponent(urlRedirect) : ''),
    [urlRedirect]
  )

  const allowAttr = [
    'w',
    'minW',
    'h',
    'pl',
    'right',
    'width',
    'height',
    'variant',
    'border',
    'fontSize',
    'bg',
    'color',
    'borderRadius',
    'display',
    'alignItems',
    'justifyContent',
  ]
  const buttonStyle: ButtonProps = useMemo(() => {
    const style = urlButtonStyle
      ? JSON.parse(decodeURIComponent(urlButtonStyle))
      : {}
    return Object.keys(style)
      .filter((key) => allowAttr.includes(key))
      .reduce(
        (obj, key) => ({
          ...obj,
          [key]: style[key],
        }),
        {}
      )
  }, [urlButtonStyle])

  const earnIconStyle: BoxProps = useMemo(
    () =>
      urlEarnIconStyle ? JSON.parse(decodeURIComponent(urlEarnIconStyle)) : {},
    [urlEarnIconStyle]
  )

  const account = useAccount()
  const api = useAPI()
  const { data, isLoading } = useQuery(
    ['subscribe-button', account, uuid],
    async () => {
      try {
        await api.getSubscribeStatus(uuid!)
        return {
          state: SubscribeState.Active,
        }
      } catch (error) {
        return {
          state: SubscribeState.Inactive,
        }
      }
    },
    {
      enabled: !!uuid && isAuth,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const onClick = () => {
    if (redirect) window.open(redirect)
  }

  if (data?.state === SubscribeState.Active) {
    return (
      <Center>
        <Button
          variant="unstyled"
          {...buttonStyle}
          pl="0"
          w={buttonStyle.minW || buttonStyle.w || '150px'}
          m="0 auto"
        >
          Subscribed
        </Button>
      </Center>
    )
  }

  if (rewardType === RewardType.AIR || isLoading) {
    return (
      <Button
        variant="unstyled"
        isLoading={isLoading}
        onClick={onClick}
        w="150px"
        {...buttonStyle}
        pl="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        Subscribe
      </Button>
    )
  }

  return (
    <Button
      onClick={onClick}
      variant="unstyled"
      w="230px"
      overflow="hidden"
      display="flex"
      justifyContent="flex-start"
      pl="24px"
      {...buttonStyle}
    >
      Subscribe
      <Center
        bg="#4E51F4"
        color="#fff"
        transform="skew(-10deg)"
        position="absolute"
        top="0"
        right="0"
        w="105px"
        h="100%"
        {...earnIconStyle}
      >
        <Box transform="skew(10deg)">Earn NFT</Box>
      </Center>
    </Button>
  )
}
