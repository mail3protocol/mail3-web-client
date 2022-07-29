import {
  Avatar as RawAvatar,
  AvatarProps as RawAvatarProps,
  SkeletonCircle,
  SkeletonProps,
  LayoutProps,
  WrapItem,
  Image,
} from '@chakra-ui/react'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import { useQuery } from 'react-query'
import {
  getCybertinoConnect,
  generateAvatarSrc,
  isEthAddress,
  isSupportedAddress,
} from 'shared'
import BoringAvatar from 'boring-avatars'
import { useMemo } from 'react'

const IS_IPHONE =
  typeof navigator !== 'undefined' &&
  navigator.userAgent.toLowerCase().includes('iphone') &&
  !navigator.vendor.includes('Google')

const IS_SAFARI =
  typeof navigator !== 'undefined' &&
  navigator.vendor?.includes('Apple') &&
  !navigator.userAgent.includes('CriOS') &&
  !navigator.userAgent.includes('FxiOS')

export interface AvatarProps extends RawAvatarProps {
  address: string
  skeletonProps?: SkeletonProps
  w?: LayoutProps['w']
  h?: LayoutProps['h']
  isSquare?: boolean
  isUseSvg?: boolean
}

const avatarsAtom = atomWithStorage<Record<string, string | undefined>>(
  'avatar_addresses',
  {},
  {
    ...createJSONStorage(() => sessionStorage),
    delayInit: false,
  }
)

const EMPTY_PLACE_HOLDER_SRC = 'empty_place_holder_image'

export const Avatar: React.FC<AvatarProps> = ({
  address,
  size,
  skeletonProps,
  isSquare,
  onClick,
  isUseSvg = false,
  ...props
}) => {
  const [avatars, setAvatars] = useAtom(avatarsAtom)
  const avatar = avatars?.[address]
  const width = props?.w
  const { isLoading } = useQuery(
    ['avatar', address],
    async () => getCybertinoConnect(address),
    {
      enabled: avatar == null && isEthAddress(address),
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        setAvatars((prev) => ({
          ...prev,
          [address]: d?.data?.identity?.avatar || EMPTY_PLACE_HOLDER_SRC,
        }))
      },
      onError() {
        setAvatars((prev) => ({
          ...prev,
          [address]: EMPTY_PLACE_HOLDER_SRC,
        }))
      },
    }
  )

  const isNonEthButValidAddress = useMemo(() => {
    if (isSupportedAddress(address) && !isEthAddress(address)) {
      return true
    }
    return false
  }, [address])

  if (avatar === EMPTY_PLACE_HOLDER_SRC || isNonEthButValidAddress) {
    return isSupportedAddress(address) ? (
      <WrapItem
        w={width}
        h={width}
        maxW={width}
        maxH={width}
        borderRadius={isSquare ? undefined : '50%'}
        overflow="hidden"
        onClick={onClick}
        cursor={onClick ? 'pointer' : undefined}
        {...props}
      >
        {!IS_IPHONE || !IS_SAFARI || isUseSvg ? (
          <BoringAvatar
            name={address.toLowerCase()}
            variant="marble"
            square
            size="100%"
            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
          />
        ) : (
          <Image
            src={generateAvatarSrc(address.toLowerCase())}
            w={width}
            h={width}
          />
        )}
      </WrapItem>
    ) : (
      <RawAvatar
        src=""
        borderRadius={isSquare ? 2 : 0}
        size={size}
        ignoreFallback
        onClick={onClick}
        {...props}
      />
    )
  }

  return isLoading || !address ? (
    <SkeletonCircle
      borderRadius={isSquare ? '4px' : '50%'}
      w={props.w}
      h={props.h}
      size={size}
      {...skeletonProps}
    />
  ) : (
    <RawAvatar
      borderRadius={isSquare ? 2 : 0}
      src={avatar}
      size={size}
      ignoreFallback
      onClick={onClick}
      {...props}
    />
  )
}
