import {
  AvatarProps as RawAvatarProps,
  SkeletonCircle,
  SkeletonProps,
  LayoutProps,
  WrapItem,
  Image,
  ImageProps,
} from '@chakra-ui/react'
import { atom, useAtom } from 'jotai'
import { useQuery } from 'react-query'
import {
  getMail3Avatar,
  getPrimitiveAddress,
  isPrimitiveEthAddress,
  DefaultAvatarType,
  envStorage,
  getSupportedAddress,
} from 'shared'
import { useEffect } from 'react'
import PngAvatarChristmas from 'assets/png/default_avatar_christmas.png'
import PngAvatar from 'assets/png/default_avatar.png'
import { RawAvatar } from './rawAvatar'

export interface AvatarProps extends RawAvatarProps {
  address: string
  src?: string
  skeletonProps?: SkeletonProps
  w?: LayoutProps['w']
  h?: LayoutProps['h']
  isSquare?: boolean
  isUseSvg?: boolean
  crossOrigin?: ImageProps['crossOrigin']
  onChangeAvatarCallback?: (currentAvatar?: string) => void
}

export const avatarsAtom = atom<Record<string, string | undefined>>({})

const EMPTY_PLACE_HOLDER_SRC = 'empty_place_holder_image'
// Constant will never change
export const DEFAULT_AVATAR_SRC =
  'https://mail-public.s3.amazonaws.com/users/default_avatar.png'

const getImageSrc = (img: string | { src: string }) =>
  typeof img === 'string' ? img : img.src

const defaultAvatarMap = {
  [DefaultAvatarType.Normal]: getImageSrc(PngAvatar),
  [DefaultAvatarType.Christmas]: getImageSrc(PngAvatarChristmas),
}

export const defaultAvatar = defaultAvatarMap[envStorage.getCurrentAvatar()]

export const Avatar: React.FC<AvatarProps> = ({
  address,
  size,
  skeletonProps,
  isSquare,
  onClick,
  src,
  onChangeAvatarCallback,
  ...props
}) => {
  const addr = getSupportedAddress(address)
  const [avatars, setAvatars] = useAtom(avatarsAtom)
  const avatar = avatars?.[addr]
  const width = props?.w
  const { isLoading } = useQuery(
    ['avatar', addr],
    async () => {
      if (isPrimitiveEthAddress(addr)) {
        const { data } = await getMail3Avatar(addr)
        return data
      }
      const { data: info } = await getPrimitiveAddress(addr)
      const { data } = await getMail3Avatar(info.eth_address)
      return data
    },
    {
      retry: 0,
      enabled: avatar == null && !!addr && !src,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        setAvatars((prev) => ({
          ...prev,
          [addr]:
            d.avatar && d.avatar !== DEFAULT_AVATAR_SRC
              ? d.avatar
              : EMPTY_PLACE_HOLDER_SRC,
        }))
      },
      onError() {
        setAvatars((prev) => ({
          ...prev,
          [addr]: EMPTY_PLACE_HOLDER_SRC,
        }))
      },
    }
  )

  useEffect(() => {
    if (src) {
      setAvatars((prev) => ({
        ...prev,
        [addr]: src === DEFAULT_AVATAR_SRC ? defaultAvatar : src,
      }))
    }
  }, [src])

  useEffect(() => {
    onChangeAvatarCallback?.(avatar)
  }, [avatar])

  if (avatar === EMPTY_PLACE_HOLDER_SRC) {
    return addr ? (
      <WrapItem
        w={width}
        h={width}
        maxW={width}
        maxH={width}
        borderRadius={isSquare ? undefined : '50%'}
        overflow="hidden"
        onClick={onClick}
        cursor={onClick ? 'pointer' : undefined}
        bg="white"
        {...props}
      >
        <Image
          src={defaultAvatar}
          w={width}
          h={width}
          crossOrigin="anonymous"
        />
      </WrapItem>
    ) : (
      <RawAvatar
        src=""
        borderRadius={isSquare ? 2 : 0}
        size={size}
        ignoreFallback
        onClick={onClick}
        bg="white"
        {...props}
      />
    )
  }

  return isLoading ? (
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
      crossOrigin="anonymous"
      bg={avatar ? 'white' : undefined}
      {...props}
    />
  )
}
