import { AspectRatio, Box, Button, Image, Link } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { atomWithStorage } from 'jotai/utils'
import { CloseIcon } from '@chakra-ui/icons'
import React from 'react'
import { useAtom } from 'jotai'
import { TrackEvent, useTrackClick } from 'hooks'
import ProductRecommendationsBannerImage from '../../assets/product_recommendations_banner/desktop.png'
import ProductRecommendationsBannerMobileImage from '../../assets/product_recommendations_banner/mobile.png'
import {
  PRODUCT_RECOMMENDATIONS_ADDRESS,
  PRODUCT_RECOMMENDATIONS_SUBJECT,
} from '../../constants'
import { RoutePath } from '../../route/path'

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
        zIndex={1}
      >
        <CloseIcon w="inherit" h="inherit" />
      </Button>
      <Link
        as={RouterLink}
        to={`${RoutePath.NewMessage}?to=${PRODUCT_RECOMMENDATIONS_ADDRESS}&subject=${PRODUCT_RECOMMENDATIONS_SUBJECT}`}
        onClick={() => trackClickBannerSuggestion()}
      >
        <AspectRatio
          ratio={4880 / 800}
          display={{ base: 'none', md: 'block' }}
          rounded="16px"
          shadow="0 0 10px 4px rgba(25, 25, 100, 0.1)"
          overflow="hidden"
          w="full"
        >
          <Image
            src={ProductRecommendationsBannerImage}
            alt="desktop_banner"
            pointerEvents="none"
          />
        </AspectRatio>
        <AspectRatio
          ratio={1340 / 500}
          display={{ base: 'block', md: 'none' }}
          rounded="24px"
          shadow="0 0 10px 4px rgba(25, 25, 100, 0.1)"
          overflow="hidden"
          w="full"
        >
          <Image
            src={ProductRecommendationsBannerMobileImage}
            alt="mobile_banner"
            pointerEvents="none"
          />
        </AspectRatio>
      </Link>
    </Box>
  )
}
