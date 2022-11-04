import { AspectRatio, Box, Button, Image } from '@chakra-ui/react'
import { atomWithStorage } from 'jotai/utils'
import { CloseIcon } from '@chakra-ui/icons'
import React from 'react'
import { useAtom } from 'jotai'
import { TrackEvent, useTrackClick } from 'hooks'
import RegisterDigitBitImage from '../../assets/event_banners/register_digit_bit.png'

const isClosedBannerAtom = atomWithStorage<boolean>(
  'is_close_product_recommendations_banner_atom',
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

export const ProductRecommendationsBanner: React.FC = () => {
  const trackClickBannerSuggestion = useTrackClick(
    TrackEvent.ClickBannerSuggestion
  )
  const [isClosedBanner, setIsCloseBanner] = useAtom(isClosedBannerAtom)
  if (isClosedBanner) return null
  return (
    <Box mb="24px" position="relative" px={{ base: '20px', sm: '0' }}>
      <Button
        variant="unstyled"
        position="absolute"
        top="20px"
        right={{ base: '40px', sm: '20px' }}
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
        zIndex={3}
      >
        <CloseIcon w="inherit" h="inherit" color="#000" />
      </Button>

      <Box
        as="a"
        href="https://mirror.xyz/mail3.eth/A8PwBRQLHzRDTHTJlGdQC-RyHoD79qa6MrUs8yFQPbM"
        target="_blank"
        position="relative"
        zIndex={2}
        onClick={() => {
          trackClickBannerSuggestion()
        }}
      >
        <AspectRatio
          ratio={1220 / 200}
          rounded="16px"
          shadow="0 0 10px 4px rgba(25, 25, 100, 0.1)"
          overflow="hidden"
          w="full"
        >
          <Image
            src={RegisterDigitBitImage}
            alt="desktop_banner"
            pointerEvents="none"
          />
        </AspectRatio>
      </Box>
    </Box>
  )
}
