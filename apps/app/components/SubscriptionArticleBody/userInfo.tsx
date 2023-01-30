import { Box, Center, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import styled from '@emotion/styled'
import { RewardType } from 'models'
import { ComponentType, useState } from 'react'
import { Avatar } from 'ui'
import { NAVBAR_HEIGHT } from '../../constants'
import type { SubscribeButtonProps } from './subscribeButton'

const LazyloadSubscribeButton: ComponentType<SubscribeButtonProps> = dynamic(
  () => import('./subscribeButton') as any,
  {
    ssr: false,
    suspense: false,
    loading: () => null,
  }
)

interface UserInfoProps {
  uuid: string
  priAddress: string
  nickname: string
  mailAddress: string
  desc?: string
  address: string
  rewardType?: RewardType
}

const AvatarArea = styled(LinkBox)`
  &:hover {
    .nickname {
      text-decoration: underline;
    }
  }
`

export const UserInfo: React.FC<UserInfoProps> = ({
  priAddress,
  nickname,
  mailAddress,
  desc,
  uuid,
  rewardType,
  address,
}) => {
  const [isHidden, setIsHidden] = useState(false)

  if (isHidden) {
    return null
  }

  return (
    <Box
      border={{ base: 'none', md: '1px solid rgba(0, 0, 0, 0.1)' }}
      borderTop="none"
      w={{ base: 'full', md: '305px' }}
    >
      <Center
        p={{ base: '10px 25px', md: '48px 32px' }}
        flexDirection="column"
        justifyContent="flex-start"
        position={{ md: 'sticky' }}
        top={{ md: `${NAVBAR_HEIGHT}px` }}
      >
        <AvatarArea w="100%">
          <LinkOverlay href={`/${address}`} target="_blank">
            <Center flexDirection="column" justifyContent="flex-start">
              <Avatar
                address={priAddress}
                borderRadius="50%"
                w={{ base: '80px', md: '100px' }}
                h={{ base: '80px', md: '100px' }}
              />
              <Text
                className="nickname"
                fontWeight="700"
                fontSize="18px"
                lineHeight="24px"
                mt="8px"
              >
                {nickname}
              </Text>
            </Center>
          </LinkOverlay>
        </AvatarArea>

        <Text
          fontWeight="500"
          fontSize="14px"
          lineHeight="16px"
          mt="14px"
          w="100%"
          textAlign="center"
        >
          {mailAddress}
        </Text>

        <Text
          fontWeight="400"
          fontSize="12px"
          lineHeight="18px"
          color="rgba(0, 0, 0, 0.7)"
          mt="32px"
          w="100%"
        >
          {desc}
        </Text>

        <LazyloadSubscribeButton
          rewardType={rewardType}
          uuid={uuid}
          setIsHidden={setIsHidden}
        />
      </Center>
    </Box>
  )
}
