import React from 'react'
import { Button, Center } from '@chakra-ui/react'
import { useAccount } from 'hooks'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
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
  let redirect = searchParams.get('redirect')
  if (redirect) {
    redirect = decodeURIComponent(redirect)
  }

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
        // eslint-disable-next-line @typescript-eslint/no-shadow
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
    <Center position="absolute" bottom="0">
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
        onClick={() => {
          if (redirect) window.open(redirect)
        }}
        isLoading={isLoading}
        disabled={data?.state === SubscribeState.Active}
      >
        {data?.state === SubscribeState.Active ? 'Subscribed' : 'Subscribe'}
      </Button>
    </Center>
  )
}
