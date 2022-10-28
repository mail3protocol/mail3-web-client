import { AspectRatio, Box, Button, Flex, Image, Link } from '@chakra-ui/react'
import { atomWithStorage } from 'jotai/utils'
import { CloseIcon } from '@chakra-ui/icons'
import React from 'react'
import { useAtom } from 'jotai'
import { TrackEvent, useTrackClick } from 'hooks'
import ProductRecommendationsBannerImage from '../../assets/product_recommendations_banner/halloween.png'

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

const areaData = `
| For Metas | @4metas | https://discord.gg/NRVxq9Uqcz | 114
| Chill | @chillweb3 | http://discord.gg/JRVvephUtZ | 105
| Weirdo Ghost Gang | @WeirdoGhostGang | https://discord.com/invite/weirdoghost | 100
| Link3 | @link3to | https://discord.gg/fGQFddXTEs | 109
| MOJOR | @Mojorcom | https://discord.gg/qty56w3HKe | 114
| Mail3 | @mail3dao | https://discord.gg/mRrdVQ2Gs8 | 142
| .bit | @dotbitHQ | http://discord.gg/did | 105
| MechCraftWorld | @MechcraftWorld | https://discord.gg/JYYrhSRfTS | 102
| Nawarat | @0xNawarat | https://discord.gg/E7m3gDy7Xs | 102
| NFTGO | @nftgoio | https://discord.gg/JAkFX3ZZ7k | 104
| LuckyBuy | @LuckyBuy_io | https://discord.com/invite/luckybuy | 133
`
  .split('\n')
  .filter((i) => i)
  .map((item) => {
    const arr = item
      .trim()
      .split('|')
      .map((i) => i.trim())
      .filter((i) => i)
    return {
      name: arr[0],
      link: arr[2],
      width: arr[3],
    }
  })

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
        <CloseIcon w="inherit" h="inherit" color="#fff" />
      </Button>

      <Box
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
            src={ProductRecommendationsBannerImage}
            alt="desktop_banner"
            pointerEvents="none"
          />
        </AspectRatio>
        <Flex
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          display={{ base: 'none', md: 'flex' }}
        >
          {areaData.map((item, index) => {
            const { name, link, width } = item

            return (
              <Link
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                w={`${width}px`}
                href={link}
                target="_blank"
                title={name}
              />
            )
          })}
        </Flex>
      </Box>
    </Box>
  )
}
