import React from 'react'
import { Box, Button, ButtonProps, Center } from '@chakra-ui/react'
import { useAccount } from 'hooks'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { EarnIconStyle } from 'ui/src/SubscribeButton'
import { useAPI } from '../../hooks/useAPI'
import { useAuth, useIsAuthenticated } from '../../hooks/useLogin'
import { ReactComponent as SvgEarn } from '../../assets/subscribe/earn.svg'
import { ReactComponent as SvgEarnWhite } from '../../assets/subscribe/earnWhite.svg'

enum SubscribeState {
  Active,
  Inactive,
}

enum EarnIconType {
  Blue = 'blue',
  White = 'white',
}

const earnIcons = {
  [EarnIconType.Blue]: <SvgEarn />,
  [EarnIconType.White]: <SvgEarnWhite />,
}

export const SubscribeButton = () => {
  useAuth()
  const isAuth = useIsAuthenticated()

  const [searchParams] = useSearchParams()

  let redirect = searchParams.get('redirect')
  if (redirect) {
    redirect = decodeURIComponent(redirect)
  }
  const uuid = searchParams.get('uuid')
  let buttonStyle = searchParams.get('buttonStyle')
  if (buttonStyle) {
    buttonStyle = JSON.parse(decodeURIComponent(buttonStyle))
  }
  const earnIconStyle: EarnIconStyle = searchParams.get('earnIconStyle')
    ? JSON.parse(decodeURIComponent(searchParams.get('earnIconStyle')!))
    : {}

  const iconType = earnIconStyle.type ?? EarnIconType.Blue

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

  return (
    <Center
      position="absolute"
      top={`${Math.abs(parseInt(earnIconStyle.top, 10))}px`}
      left="0px"
    >
      <Button
        w="150px"
        h="28px"
        variant="unstyled"
        border="1px solid #000000"
        fontSize="14px"
        bg="#fff"
        color="#000"
        borderRadius="100px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        // TODO just allow style attribute
        {...(buttonStyle as ButtonProps)}
        onClick={() => {
          if (data?.state === SubscribeState.Active) return
          if (redirect) window.open(redirect)
        }}
        isLoading={isLoading}
      >
        {data?.state === SubscribeState.Active ? 'Subscribed' : 'Subscribe'}
      </Button>
      {!isLoading && data?.state !== SubscribeState.Active ? (
        <Box
          position="absolute"
          left={earnIconStyle.left}
          top={earnIconStyle.top}
          zIndex={9}
          pointerEvents="none"
        >
          {earnIcons[iconType as EarnIconType]}
        </Box>
      ) : null}
    </Center>
  )
}
