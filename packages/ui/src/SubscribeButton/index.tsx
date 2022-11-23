import { Box, Button, ButtonProps, Center } from '@chakra-ui/react'
import { useMemo, useState } from 'react'

export interface EarnIconStyle {
  type: string
  top: string
  left: string
}

export const SubscribeButton: React.FC<
  ButtonProps & {
    uuid: string
    host: string
    iframeHeight: string
    utmSource: string
    earnIconStyle: EarnIconStyle
  }
> = ({
  uuid,
  host,
  iframeHeight,
  utmSource,
  earnIconStyle,
  ...buttonProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const iframeSrc = useMemo(
    () => `${host}/subscribe/button?uuid=${uuid}
    &redirect=${encodeURIComponent(
      `${host}/subscribe/${uuid}?utm_source=${utmSource}&utm_medium=click_subscribe_button`
    )}
    &buttonStyle=${encodeURIComponent(JSON.stringify(buttonProps))}
    &earnIconStyle=${encodeURIComponent(JSON.stringify(earnIconStyle))}
    `,
    [host, uuid, utmSource, buttonProps, earnIconStyle]
  )

  const ButtonRemote = (
    <Box position="absolute" bottom="0px" left="0">
      <iframe
        style={{
          display: 'block',
          width: isLoaded ? '100%' : '0px',
          height: isLoaded ? iframeHeight : '0px',
          overflow: 'hidden',
        }}
        src={iframeSrc}
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
