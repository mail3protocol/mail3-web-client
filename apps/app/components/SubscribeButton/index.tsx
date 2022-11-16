import { Button, Center } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export const SubscribeButton = () => {
  const [searchParams] = useSearchParams()
  let redirect = searchParams.get('redirect')
  const uuid = searchParams.get('uuid')
  if (redirect) {
    redirect = decodeURIComponent(redirect)
  }
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    // if subscribe
    // else
    setIsSubscribed(false)
    console.log('fetch data', uuid, redirect)
  }, [])

  return (
    <Center>
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
          console.log('open')
          if (redirect) window.open(redirect)
        }}
      >
        {isSubscribed ? 'Subscribed' : 'Subscribe'}
      </Button>
    </Center>
  )
}
