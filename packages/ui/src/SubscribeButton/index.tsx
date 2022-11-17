import { Box, Button, Center } from '@chakra-ui/react'
import { useState } from 'react'

export const SubscribeButton = ({
  uuid,
  host,
}: {
  uuid: string
  host: string
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const ButtonRemote = (
    <Box position="absolute" bottom="0px" left="0">
      <iframe
        style={{
          display: 'block',
          width: isLoaded ? '100%' : '0px',
          height: isLoaded ? '48px' : '0px',
          overflow: 'hidden',
        }}
        src={`${host}/subscribe/button?uuid=${uuid}&redirect=${encodeURIComponent(
          `${host}/subscribe/${uuid}?utm_source=${location.host}&utm_medium=click_subscribe_button`
        )}`}
        onLoad={() => {
          setIsLoaded(true)
        }}
        title="subscribe"
      />
    </Box>
  )

  const ButtonLocal = (
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
        as="a"
        target="_blank"
        display="flex"
        alignItems="center"
        justifyContent="center"
        href={`${host}/subscribe/${uuid}?utm_source=${location.host}&utm_medium=click_subscribe_button`}
        isLoading={!isLoaded}
      >
        Subscribe
      </Button>
    </Center>
  )

  return (
    <Box
      mt={{ base: '10px', md: '25px' }}
      h="28px"
      w="150px"
      position="relative"
    >
      {ButtonRemote}
      {!isLoaded ? ButtonLocal : null}
    </Box>
  )
}
