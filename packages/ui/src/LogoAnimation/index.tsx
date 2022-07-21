import { AspectRatio, Box, Image, BoxProps } from '@chakra-ui/react'
import LogoSpritesPath from 'assets/png/logo-sprites.png'
import styled from '@emotion/styled'

const LogoImageAnimation = styled(Image)`
  animation: 3s logo-image-run steps(18) infinite;
  @keyframes logo-image-run {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-100%);
    }
  }
`

export const LogoAnimation: React.FC<BoxProps> = ({ ...props }) => (
  <Box w="full" {...props}>
    <AspectRatio ratio={334 / 132} w="full" h="auto">
      <Box overflow="hidden">
        <LogoImageAnimation
          src={LogoSpritesPath.src}
          position="absolute"
          w="full"
          h="auto"
          top="0"
          left="0"
        />
      </Box>
    </AspectRatio>
  </Box>
)
