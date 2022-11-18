import { Box, Button, ButtonProps, Center } from '@chakra-ui/react'
import { useState } from 'react'

export const SubscribeButton: React.FC<
  ButtonProps & {
    uuid: string
    host: string
    iframeHeight: string
    utmSource: string
  }
> = ({ uuid, host, iframeHeight, utmSource, ...buttonProps }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const ButtonRemote = (
    <Box position="absolute" bottom="0px" left="0">
      <iframe
        style={{
          display: 'block',
          width: isLoaded ? '100%' : '0px',
          height: isLoaded ? iframeHeight : '0px',
          overflow: 'hidden',
        }}
        src={`${host}/subscribe/button?uuid=${uuid}
        &redirect=${encodeURIComponent(
          `${host}/subscribe/${uuid}?utm_source=${utmSource}&utm_medium=click_subscribe_button`
        )}
        &buttonStyle=${encodeURIComponent(JSON.stringify(buttonProps))}
        &earnIconType=blue
        `}
        onLoad={() => {
          setIsLoaded(true)
        }}
        title="subscribe"
      />
    </Box>
  )

  const ButtonLocal = (
    <Center>
      <Button {...buttonProps} isLoading={!isLoaded}>
        Subscribe
      </Button>
    </Center>
  )

  return (
    <Box h={buttonProps.h} w={buttonProps.w} position="relative">
      {ButtonRemote}
      {!isLoaded ? ButtonLocal : null}
    </Box>
  )
}
