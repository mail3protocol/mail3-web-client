import {
  AspectRatio,
  Box,
  Button,
  Center,
  chakra,
  Heading,
  Image,
  ImageProps,
  shouldForwardProp,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import {
  AnimationControls,
  isValidMotionProp,
  motion,
  TargetAndTransition,
  Transition,
  VariantLabels,
} from 'framer-motion'
import { useAccount, useEagerConnect } from 'hooks'
import { Navigate } from 'react-router-dom'
import MascotPng from '../../assets/LoginHomePage/mascot.png'
import BellPng from '../../assets/LoginHomePage/bell.png'
import CursorPng from '../../assets/LoginHomePage/cursor.png'
import DiamondPng from '../../assets/LoginHomePage/diamond.png'
import LikePng from '../../assets/LoginHomePage/like.png'
import PlanePng from '../../assets/LoginHomePage/plane.png'
import VisionPng from '../../assets/LoginHomePage/vision.png'
import BackgroundPng from '../../assets/LoginHomePage/background.png'
import { useOpenConnectWalletDialog } from '../../hooks/useConnectWalletDialog'
import { useAuth, useIsAuthenticated } from '../../hooks/useLogin'
import { useOpenAuthModal } from '../../hooks/useAuthDialog'
import { RoutePath } from '../../route/path'

const MotionImage = chakra(motion.img, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
})

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
})

const MotionImageTransition: any = {
  delay: 1.5,
  duration: 0.5,
  ease: 'easeOut',
}

const MotionBoxTransition: any = {
  duration: 3,
  ease: 'easeInOut',
  repeat: Infinity,
  repeatType: 'loop',
}

export const AnimationImage: React.FC<
  Pick<ImageProps, 'src' | 'top' | 'right' | 'bottom' | 'left' | 'w'> & {
    animate?: AnimationControls | TargetAndTransition | VariantLabels
    transition?: Transition
    containerTransition?: Transition
  }
> = ({
  animate = {
    x: 0,
    y: 0,
  },
  containerTransition,
  transition,
  src,
  top,
  right,
  bottom,
  left,
  w,
}) => (
  <MotionBox
    position="absolute"
    h="auto"
    animate={{
      y: [5, -5, 5],
    }}
    transition={{ ...MotionBoxTransition, ...containerTransition }}
    {...{
      top,
      right,
      bottom,
      left,
      w,
    }}
  >
    <MotionImage
      animate={animate}
      transition={{ ...MotionImageTransition, ...transition }}
      src={src}
      h="auto"
      w="full"
      zIndex={1}
    />
  </MotionBox>
)

export const Content: React.FC = () => {
  const { t } = useTranslation(['login_home_page', 'common'])
  const onOpenConnectWalletDialog = useOpenConnectWalletDialog()
  const account = useAccount()
  const onOpenAuthDialog = useOpenAuthModal()
  const isAuth = useIsAuthenticated()
  useAuth()
  useEagerConnect()

  if (isAuth) {
    return <Navigate to={`${RoutePath.Dashboard}`} replace />
  }

  return (
    <Center
      flexDirection="column"
      alignItems="flex-start"
      h="full"
      w="full"
      flex={1}
      pl="108px"
      position="relative"
      userSelect="none"
    >
      <Box position="relative" zIndex={2} userSelect="text">
        <Heading
          as="h2"
          fontWeight="600"
          fontSize={{ base: '36px', '2xl': '46px', '3xl': '56px' }}
          lineHeight={{ base: '56px', '2xl': '74px', '3xl': '87px' }}
          mb={{ base: '22px', '2xl': '34px' }}
          transition="200ms"
        >
          {t('say_hi')}
        </Heading>
        <Heading
          as="h1"
          whiteSpace="pre"
          fontSize={{ base: '48px', '2xl': '60px', '3xl': '74px' }}
          lineHeight={{ base: '56px', '2xl': '74px', '3xl': '87px' }}
          fontWeight="900"
          mb={{ base: '32px', '2xl': '50px' }}
          transition="200ms"
        >
          {t('title')}
        </Heading>
        <Button
          rounded="99px"
          bg="rainbow"
          color="loginHomePage.background"
          h="34px"
          lineHeight="34px"
          px="31px"
          fontWeight="900"
          mb="16px"
          _hover={{
            bg: 'rainbow',
            transform: 'scale(1.05)',
          }}
          _active={{
            bg: 'rainbow',
            transform: 'scale(0.99)',
          }}
          shadow="xl"
          onClick={async () => {
            if (account) {
              onOpenAuthDialog()
            } else {
              onOpenConnectWalletDialog()
            }
          }}
        >
          {t('connect_wallet', { ns: 'common' })}
        </Button>
      </Box>
      <Image
        src={BackgroundPng}
        position="absolute"
        w="72%"
        h="auto"
        bottom="0"
        right="0"
        zIndex={0}
        pointerEvents="none"
      />
      <AnimationImage
        src={CursorPng}
        bottom="63px"
        left="143px"
        w="4%"
        containerTransition={{ delay: 0.6 }}
        animate={{
          x: 0,
          y: 0,
        }}
      />
      <AspectRatio
        ratio={716 / 636}
        position="absolute"
        w="37%"
        bottom="0"
        right="16.5%"
      >
        <Box style={{ overflow: 'visible' }} pointerEvents="none">
          <Image src={MascotPng} w="full" h="full" zIndex={2} />
          <AnimationImage
            animate={{
              x: [300, 0],
              y: [-100, 0],
              scale: [0.5, 1],
            }}
            containerTransition={{ delay: 0.3 }}
            src={DiamondPng}
            bottom="10%"
            left="-10%"
            w="16%"
          />
          <AnimationImage
            animate={{
              x: [140, 0],
              y: [300, 0],
              scale: [0.5, 1],
            }}
            containerTransition={{ delay: 0.8 }}
            src={LikePng}
            bottom="88%"
            left="10%"
            w="24%"
          />
          <AnimationImage
            animate={{
              x: [-90, 0],
              y: [300, 0],
              scale: [0.5, 1],
            }}
            containerTransition={{ delay: 1.4 }}
            src={VisionPng}
            bottom="94%"
            right="10%"
            w="19%"
          />
          <AnimationImage
            animate={{
              x: [-230, 0],
              y: [260, 0],
              scale: [0.5, 1],
            }}
            containerTransition={{ delay: 2 }}
            src={BellPng}
            bottom="65%"
            right="-20%"
            w="21%"
          />
          <AnimationImage
            animate={{
              x: [-280, 0],
              y: [-10, 0],
              scale: [0.5, 1],
            }}
            src={PlanePng}
            bottom="16%"
            right="-30%"
            w="32%"
          />
        </Box>
      </AspectRatio>
    </Center>
  )
}
