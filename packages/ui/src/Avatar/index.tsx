import {
  Avatar as RawAvatar,
  AvatarProps as RawAvatarProps,
  SkeletonCircle,
  SkeletonProps,
  LayoutProps,
  WrapItem,
} from '@chakra-ui/react'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import { useQuery } from 'react-query'
import BoringAvatar from 'boring-avatars'

export interface AvatarProps extends RawAvatarProps {
  address: string
  skeletonProps?: SkeletonProps
  w?: LayoutProps['w']
  h?: LayoutProps['h']
  isSquare?: boolean
}

const isEthAddress = (address?: string) =>
  address && (address.startsWith('0x') || address?.endsWith('.eth'))

const isSupportedAddress = (address?: string) => {
  if (address) {
    if (isEthAddress(address)) {
      return true
    }
    if (address.startsWith('zil')) {
      return true
    }
  }
  return false
}

const avatarsAtom = atomWithStorage<Record<string, string | undefined>>(
  'avatar_addresses',
  {},
  {
    ...createJSONStorage(() => sessionStorage),
    delayInit: false,
  }
)

export const avatarQuery = (
  address: string,
  chain = 'ETH'
) => `query FullIdentityQuery {
  identity(
    address: "${address}"
    network: ${chain}
  ) {
    address
    domain
    avatar
    joinTime
  }
}`

const EMPTY_PLACE_HOLDER_SRC = 'empty_place_holder_image'

export const Avatar: React.FC<AvatarProps> = ({
  address,
  size,
  skeletonProps,
  isSquare,
  onClick,
  ...props
}) => {
  const [avatars, setAvatars] = useAtom(avatarsAtom)
  const avatar = avatars?.[address]
  const width = props?.w
  const { isLoading } = useQuery(
    ['avatar', address],
    async () =>
      // eslint-disable-next-line compat/compat
      fetch('https://api.cybertino.io/connect/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query: avatarQuery(address) }),
      }).then((res) => res.json()),
    {
      enabled: avatar == null && isSupportedAddress(address),
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

  if (avatar === EMPTY_PLACE_HOLDER_SRC) {
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
      >
        <BoringAvatar
          name={address.toLowerCase()}
          variant="marble"
          square
          size="100%"
          colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
        />
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
