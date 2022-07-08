import { AspectRatio, Box, Image, Icon, Link, Button } from '@chakra-ui/react'
import React from 'react'
import styled from '@emotion/styled'
import { TrackEvent, useTrackClick } from 'hooks'
import { CloseIcon } from '@chakra-ui/icons'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import DriftingBottleBannerImage from '../../assets/driftibottle/banner.png'
import DriftingBottleBannerMobileImage from '../../assets/driftibottle/banner-mobile.png'
import { ReactComponent as GoToEditDriftingBottleButtonSvg } from '../../assets/driftibottle/go-to-send-driftingbottle.svg'
import { RoutePath } from '../../route/path'
import { RouterLink } from '../RouterLink'

export const AnimationContainer = styled(Link)`
  display: block;
  @keyframes DriftbottleBannerButtonAnimation {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  &:hover {
    opacity: 1;
    animation: unset;
  }
`

const isClosedBannerAtom = atomWithStorage<boolean>(
  'is_close_banner_atom',
  false,
  {
    removeItem(key) {
      sessionStorage.removeItem(key)
    },
    getItem(key) {
      return sessionStorage.getItem(key) === 'true'
    },
    setItem(key, value) {
      sessionStorage.setItem(key, `${value ? 'true' : 'false'}`)
    },
  }
)

export const DriftbottleBanner: React.FC = () => {
  const trackClickDriftbottleBanner = useTrackClick(
    TrackEvent.ClickDriftbottleBanner
  )
  const [isClosedBanner, setIsCloseBanner] = useAtom(isClosedBannerAtom)
  if (isClosedBanner) return null
  return (
    <AspectRatio
      position="relative"
      w="full"
      ratio={{
        base: 1340 / 400,
        md: 2400 / 400,
      }}
      mt="24px"
    >
      <RouterLink href={`${RoutePath.NewMessage}?action=driftbottle`} passHref>
        <AnimationContainer
          w="full"
          h="full"
          bg="#fff"
          rounded={{ base: '16px', md: '24px' }}
          shadow="0 0 10px 4px rgba(25, 25, 100, 0.1)"
          onClick={() => {
            trackClickDriftbottleBanner()
          }}
        >
          <Button
            variant="unstyled"
            position="absolute"
            top="20px"
            right="20px"
            w={{ base: '12px', md: '16px' }}
            h={{ base: '12px', md: '16px' }}
            minW="unset"
            minH="unset"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setIsCloseBanner(true)
            }}
          >
            <CloseIcon w="inherit" h="inherit" />
          </Button>
          <Image
            src={DriftingBottleBannerImage}
            display={{ base: 'none', md: 'block' }}
          />
          <Image
            src={DriftingBottleBannerMobileImage}
            display={{ base: 'block', md: 'none' }}
          />
          <Box
            position="absolute"
            left={{ base: '60%', md: '55%' }}
            top="62%"
            width={{ base: '15%', md: '11%' }}
            animation="DriftbottleBannerButtonAnimation 2s infinite linear"
          >
            <Icon as={GoToEditDriftingBottleButtonSvg} w="full" h="full" />
          </Box>
        </AnimationContainer>
      </RouterLink>
    </AspectRatio>
  )
}
