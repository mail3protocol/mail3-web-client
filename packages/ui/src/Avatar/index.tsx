import {
  Avatar as RawAvatar,
  AvatarProps as RawAvatarProps,
  SkeletonCircle,
  SkeletonProps,
  LayoutProps,
} from '@chakra-ui/react'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import { useQuery } from 'react-query'

export interface AvatarProps extends RawAvatarProps {
  address: string
  skeletonProps?: SkeletonProps
  w: LayoutProps['w']
  h: LayoutProps['h']
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

const defaultAvatarUrl = (address: string) =>
  `https://source.boringavatars.com/marble/300/${address}`

export const Avatar: React.FC<AvatarProps> = ({
  address,
  size,
  skeletonProps,
  ...props
}) => {
  const [avatars, setAvatars] = useAtom(avatarsAtom)
  const avatar = avatars?.[address]
  useQuery(
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
      enabled: avatar == null && !!address,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        setAvatars((prev) => ({
          ...prev,
          [address]: d?.data?.identity?.avatar || defaultAvatarUrl(address),
        }))
      },
    }
  )

  return !avatar ? (
    <SkeletonCircle w={props.w} h={props.h} size={size} {...skeletonProps} />
  ) : (
    <RawAvatar src={avatar} size={size} ignoreFallback {...props} />
  )
}
