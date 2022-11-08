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
  generateAvatarSrc,
  isEthAddress,
  isSupportedAddress,
  getMail3Avatar,
  getPrimitiveAddress,
  isPrimitiveEthAddress,
} from 'shared'
import BoringAvatar from 'boring-avatars'
import { useEffect, useMemo } from 'react'

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
  src?: string
  skeletonProps?: SkeletonProps
  w?: LayoutProps['w']
  h?: LayoutProps['h']
  isSquare?: boolean
  isUseSvg?: boolean
  onChangeAvatarCallback?: (currentAvatar?: string) => void
}

export const avatarsAtom = atomWithStorage<Record<string, string | undefined>>(
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
  src,
  onChangeAvatarCallback,
  ...props
}) => {
  const [avatars, setAvatars] = useAtom(avatarsAtom)
  const avatar = avatars?.[address]
  const width = props?.w
  const { isLoading } = useQuery(
    ['avatar', address],
    async () => {
      if (isPrimitiveEthAddress(address)) {
        const { data } = await getMail3Avatar(address)
        return data
      }
      const { data: info } = await getPrimitiveAddress(address)
      const { data } = await getMail3Avatar(info.eth_address)
      return data
    },
    {
      enabled: avatar == null && isEthAddress(address) && !src,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        setAvatars((prev) => ({
          ...prev,
          [address]: d.avatar || EMPTY_PLACE_HOLDER_SRC,
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

  useEffect(() => {
    if (src) {
      setAvatars((prev) => ({
        ...prev,
        [address]: src,
      }))
    }
  }, [src])

  useEffect(() => {
    onChangeAvatarCallback?.(avatar)
  }, [avatar])

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
      borderRadius={isSquare ? '2' : 0}
      src={avatar}
      size={size}
      ignoreFallback
      onClick={onClick}
      {...props}
    />
  )
}
