import { Box, Center, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { RewardType } from 'models'
import { useState } from 'react'

import { Avatar } from 'ui'
import { NAVBAR_HEIGHT } from '../../constants'
import { SubscribeButtonInApp } from '../SubscribeButtonInApp'

interface UserInfoProps {
  uuid: string
  priAddress: string
  nickname: string
  mailAddress: string
  desc?: string
  isAuth: boolean
  address: string
  rewardType?: RewardType
  avatar?: string
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
  isAuth,
  avatar,
}) => {
  const [isHidden, setIsHidden] = useState(false)

  if (isHidden) {
    return null
  }

  return (
    <Box
      border={{ base: 'none', md: '1px solid rgba(0, 0, 0, 0.1)' }}
      borderTop={{ md: 'none' }}
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
                src={avatar}
                address={priAddress}
                borderRadius="50%"
                name={nickname}
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

        <SubscribeButtonInApp
          mt="24px"
          rewardType={rewardType}
          isAuth={isAuth}
          uuid={uuid}
          setIsHidden={setIsHidden}
        />
      </Center>
    </Box>
  )
}
