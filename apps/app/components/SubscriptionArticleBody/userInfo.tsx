import {
  Box,
  Center,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useAccount, useDialog, useToast } from 'hooks'
import { RewardType } from 'models'
import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Avatar, Button } from 'ui'
import { Query } from '../../api/query'
import { NAVBAR_HEIGHT } from '../../constants'
import { useAPI } from '../../hooks/useAPI'
import { SimpleSubscribePage } from '../../pages/subscribe'

interface UserInfoProps {
  uuid: string
  priAddress: string
  nickname: string
  mailAddress: string
  desc?: string
  isAuth: boolean
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

const SubscribeButtonView: React.FC<{
  rewardType?: RewardType
  isFollow?: boolean
  onClick?: () => void
  isLoading: boolean
}> = ({ rewardType, isFollow, onClick, isLoading }) => {
  if (isFollow) {
    return (
      <Button
        isLoading={isLoading}
        onClick={onClick}
        variant="outline"
        w="150px"
      >
        Subscribed
      </Button>
    )
  }

  if (rewardType === RewardType.AIR || isLoading) {
    return (
      <Button isLoading={isLoading} onClick={onClick} w="150px">
        Subscribe
      </Button>
    )
  }

  return (
    <Button
      isLoading={isLoading}
      onClick={onClick}
      w="230px"
      overflow="hidden"
      justifyContent="flex-start"
      pl="24px"
    >
      Subscribe
      <Center
        bg="#4E52F5"
        transform="skew(-10deg)"
        position="absolute"
        top="0"
        right="0"
        w="105px"
        h="100%"
      >
        <Box transform="skew(10deg)">Earn NFT</Box>
      </Center>
    </Button>
  )
}

export const SubscribeButton: React.FC<{
  isAuth: boolean
  rewardType?: RewardType
  uuid: string
  setIsHidden?: Dispatch<SetStateAction<boolean>>
}> = ({ isAuth, rewardType, uuid, setIsHidden }) => {
  const [t] = useTranslation('subscription')
  const api = useAPI()
  const toast = useToast()
  const dialog = useDialog()
  const account = useAccount()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isFollow, setIsFollow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = useBreakpointValue({ base: true, md: false })

  const { isLoading: isLoadingStatus, refetch } = useQuery(
    [Query.GetSubscribeStatus, account, uuid],
    async () => {
      try {
        await api.getSubscribeStatus(uuid)
        return {
          state: 'active',
        }
      } catch (error: any) {
        if (
          error?.response?.status === 404 &&
          error?.response?.data?.reason === 'COMMUNITY_USER_FOLLOWING_NOT_FOUND'
        ) {
          return {
            state: 'inactive',
          }
        }
        throw error
      }
    },
    {
      onSuccess(data) {
        const isFollowed = data.state === 'active'
        setIsFollow(isFollowed)
        if (isMobile && isFollowed && setIsHidden) setIsHidden(true)
      },
      enabled: !!uuid && isAuth,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const onSubscribe = async () => {
    if (isLoading) return
    setIsLoading(true)
    if (isFollow) {
      dialog({
        type: 'text',
        description: t('unsubscribe'),
        showCloseButton: true,
        modalBodyProps: {
          mt: '0',
        },
        modalCloseButtonProps: {
          zIndex: 9,
        },
        modalFooterProps: {
          pt: 0,
        },
        onConfirm: () => {
          setIsLoading(false)
        },
        onCancel: async () => {
          await api.SubscriptionCommunityUserUnFollowing(uuid)
          setIsFollow(false)
          setIsLoading(false)
          toast(t('Unsubscribe successfully'), { status: 'success' })
        },
        onClose: () => {
          setIsLoading(false)
        },
        okText: 'No',
        cancelText: 'Yes',
      })
    } else {
      await api.SubscriptionCommunityUserFollowing(uuid)
      setIsFollow(true)
      toast(t('Subscribe successfully'), { status: 'success' })
      setIsLoading(false)
    }
  }

  return (
    <>
      <Box mt="24px">
        <SubscribeButtonView
          onClick={isAuth ? onSubscribe : onOpen}
          rewardType={rewardType}
          isFollow={isFollow}
          isLoading={isLoadingStatus || isLoading}
        />
      </Box>
      <Modal
        onClose={() => {
          if (isAuth) refetch()
          onClose()
        }}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent maxW={{ base: '100%', md: '80vw' }} h="80vh">
          <ModalCloseButton />
          <ModalBody>
            <SimpleSubscribePage isDialog uuid={uuid} rewardType={rewardType} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export const UserInfo: React.FC<UserInfoProps> = ({
  priAddress,
  nickname,
  mailAddress,
  desc,
  uuid,
  rewardType,
  address,
  isAuth,
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

        <SubscribeButton
          rewardType={rewardType}
          isAuth={isAuth}
          uuid={uuid}
          setIsHidden={setIsHidden}
        />
      </Center>
    </Box>
  )
}
