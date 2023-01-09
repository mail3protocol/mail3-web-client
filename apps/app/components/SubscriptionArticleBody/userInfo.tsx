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
  useDisclosure,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useAccount, useDialog, useToast } from 'hooks'
import { RewardType } from 'models'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Avatar, Button } from 'ui'
import { Query } from '../../api/query'
import { useAPI } from '../../hooks/useAPI'
import { SimpleSubscribePage } from '../../pages/subscribe'

interface UserInfoProps {
  uuid: string
  priAddress: string
  nickname: string
  mailAddress: string
  desc?: string
  isAuth: boolean
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
      <Button isLoading={isLoading} onClick={onClick}>
        Subscribed
      </Button>
    )
  }

  if (rewardType === RewardType.AIR) {
    return (
      <Button isLoading={isLoading} onClick={onClick}>
        Subscribe
      </Button>
    )
  }

  return (
    <Button isLoading={isLoading} onClick={onClick}>
      Subscribe / nft
    </Button>
  )
}

const SubscribeButton: React.FC<{
  isAuth: boolean
  rewardType?: RewardType
  onOpen: () => void
  uuid: string
}> = ({ isAuth, rewardType, onOpen, uuid }) => {
  const [t] = useTranslation('subscription')
  const api = useAPI()
  const toast = useToast()
  const dialog = useDialog()
  const [isFollow, setIsFollow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const account = useAccount()

  const { isLoading: isLoadingStatus } = useQuery(
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
        setIsFollow(data.state === 'active')
      },
      enabled: !!uuid && isAuth,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    setIsLoading(isLoadingStatus)
  }, [isLoadingStatus])

  const onSubscribe = async () => {
    if (isLoading) return
    setIsLoading(true)
    console.log('isFollow', isFollow)
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
    <Box mt="24px">
      <SubscribeButtonView
        onClick={isAuth ? onSubscribe : onOpen}
        rewardType={rewardType}
        isFollow={isFollow}
        isLoading={isLoading}
      />
    </Box>
  )
}

export const UserInfo: React.FC<UserInfoProps> = ({
  priAddress,
  nickname,
  mailAddress,
  desc,
  uuid,
  rewardType,
  isAuth,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Center
      p={{ base: '10px 25px', md: '48px 32px' }}
      w={{ base: 'full', md: '305px' }}
      flexDirection="column"
      justifyContent="flex-start"
      border={{ base: 'none', md: '1px solid rgba(0, 0, 0, 0.1)' }}
      borderTop="none"
    >
      <AvatarArea w="100%">
        <LinkOverlay href="#">
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

      <Text fontWeight="500" fontSize="14px" lineHeight="16px" mt="14px">
        {mailAddress}
      </Text>

      <Text
        fontWeight="400"
        fontSize="12px"
        lineHeight="18px"
        color="rgba(0, 0, 0, 0.7)"
        mt="32px"
      >
        {desc}
      </Text>

      <SubscribeButton
        onOpen={onOpen}
        rewardType={RewardType.AIR}
        isAuth={isAuth}
        uuid={uuid}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent maxW="80vw" h="80vh">
          <ModalCloseButton />
          <ModalBody>
            <SimpleSubscribePage isDialog uuid={uuid} rewardType={rewardType} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Center>
  )
}
