import { Box, BoxProps, Button, ButtonProps } from '@chakra-ui/react'
import { useMemo, useState } from 'react'

export const SubscribeButton: React.FC<
  ButtonProps & {
    uuid: string
    host: string
    iframeHeight: string
    utmSource: string
    utmCampaign?: string
    rewardType?: string
    earnIconStyle: BoxProps
  }
> = ({
  uuid,
  host,
  iframeHeight,
  utmSource,
  utmCampaign = '',
  earnIconStyle,
  rewardType,
  ...buttonProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const iframeSrc = useMemo(
    () => `${host}/subscribe/button?uuid=${uuid}
    &redirect=${encodeURIComponent(
      `${host}/subscribe/${uuid}?utm_source=${utmSource}&utm_campaign=${utmCampaign}&utm_medium=${
        rewardType === 'air'
          ? 'click_subscribe_default_button'
          : 'click_subscribe_button'
      }&reward_type=${rewardType}`
    )}
    &buttonStyle=${encodeURIComponent(JSON.stringify(buttonProps))}
    &earnIconStyle=${encodeURIComponent(JSON.stringify(earnIconStyle))}
    &rewardType=${rewardType}
    `,
    [host, uuid, utmSource, buttonProps, earnIconStyle, rewardType]
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

  return (
    <Box h={buttonProps.h} w={buttonProps.w} position="relative">
      {ButtonRemote}
      {!isLoaded ? (
        <Button
          {...buttonProps}
          variant="unstyled"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pl="0"
          isLoading
          _hover={{ _disabled: { bg: buttonProps.bg } }}
        />
      ) : null}
    </Box>
  )
}
