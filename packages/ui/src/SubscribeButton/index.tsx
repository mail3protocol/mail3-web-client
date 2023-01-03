import { Box, Button, ButtonProps, Center } from '@chakra-ui/react'
import { RewardType } from 'models'
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
    utmCampaign?: string
    rewardType?: RewardType
    earnIconStyle: EarnIconStyle
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
        rewardType === RewardType.AIR
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
