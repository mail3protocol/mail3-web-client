import {
  Box,
  BoxProps,
  Center,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import { useAccount, useDialog, useToast } from 'hooks'
import { RewardType } from 'models'
import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Button } from 'ui'
import { ReactComponent as SubWhiteSvg } from 'assets/subscribe-page/subscribe-white.svg'
import { ReactComponent as SubSvg } from 'assets/subscribe-page/subscribe.svg'
import { atom, useAtom, useAtomValue } from 'jotai'
import { Query } from '../../api/query'
import { useAPI } from '../../hooks/useAPI'
import { SimpleSubscribePage } from '../../csr_pages/subscribe'

const SubscribeButtonView: React.FC<{
  rewardType?: RewardType
  isFollow?: boolean
  onClick?: () => void
  isLoading: boolean
}> = ({ rewardType, isFollow, onClick, isLoading }) => {
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (isFollow) {
    return (
      <Button
        isLoading={isLoading}
        onClick={onClick}
        variant="outline"
        w={{ base: '104px', md: '158px' }}
        h={{ base: '22px', md: '34px' }}
        leftIcon={<Icon as={SubSvg} mr="-2px" w="16px" h="16px" />}
        fontSize={{ base: '12px', md: '14px' }}
        color="#666666"
        borderColor="#666"
      >
        Subscribed
      </Button>
    )
  }

  if (rewardType === RewardType.AIR || isLoading) {
    return (
      <Button
        isLoading={isLoading}
        onClick={onClick}
        w={{ base: '104px', md: '158px' }}
        h={{ base: '22px', md: '34px' }}
        leftIcon={<Icon as={SubWhiteSvg} mr="-2px" w="16px" h="16px" />}
        fontSize={{ base: '12px', md: '14px' }}
        pl={{ base: '8px', md: '18px' }}
        pr={{ base: '8px', md: '18px' }}
      >
        Subscribe
      </Button>
    )
  }

  return (
    <Button
      isLoading={isLoading}
      w={{ base: '90px', md: '210px' }}
      h={{ base: '22px', md: '34px' }}
      onClick={onClick}
      overflow="hidden"
      justifyContent="flex-start"
      pl={{ base: '8px', md: '18px' }}
      fontSize={{ base: '12px', md: '14px' }}
      leftIcon={<Icon as={SubWhiteSvg} mr="-2px" w="16px" h="16px" />}
    >
      {!isMobile ? 'Subscribe' : null}
      <Center
        bg="#4E52F5"
        transform="skew(-10deg)"
        position="absolute"
        top="0"
        right="0"
        w={{ base: '62px', md: '88px' }}
        h="100%"
        fontSize={{ base: '12px', md: '14px' }}
      >
        <Box transform="skew(10deg)">Earn NFT</Box>
      </Center>
    </Button>
  )
}

export const subscribeButtonIsFollowAtom = atom(false)
export const isSimpleSubscribeModelAtom = atom(false)

export const SubscribeButtonInApp: React.FC<
  {
    isAuth: boolean
    rewardType?: RewardType
    uuid: string
    setIsHidden?: Dispatch<SetStateAction<boolean>>
  } & BoxProps
> = ({ isAuth, rewardType, uuid, setIsHidden, ...props }) => {
  const [t] = useTranslation('subscription')
  const api = useAPI()
  const toast = useToast()
  const dialog = useDialog()
  const account = useAccount()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isFollow, setIsFollow] = useAtom(subscribeButtonIsFollowAtom)
  const isSimpleModel = useAtomValue(isSimpleSubscribeModelAtom)
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
        // console.log(error.response)
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
      <Box {...props}>
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
        {isSimpleModel ? (
          <ModalContent
            maxW={{ base: '100%', md: '500px' }}
            overflow="hidden"
            overflowY="scroll"
            backgroundColor="transparent"
            boxShadow="none"
            css={{
              '&::-webkit-scrollbar': {
                width: '0 !important',
                height: '0 !important',
              },
            }}
          >
            <ModalBody>
              <SimpleSubscribePage
                isDialog
                uuid={uuid}
                rewardType={rewardType}
                onCloseModal={onClose}
              />
            </ModalBody>
          </ModalContent>
        ) : (
          <ModalContent
            maxW={{ base: '100%', md: '800px' }}
            h="85vh"
            overflow="hidden"
            overflowY="scroll"
            css={{
              '&::-webkit-scrollbar': {
                width: '0 !important',
                height: '0 !important',
              },
            }}
          >
            <ModalCloseButton />
            <ModalBody>
              <SimpleSubscribePage
                isDialog
                uuid={uuid}
                rewardType={rewardType}
              />
            </ModalBody>
          </ModalContent>
        )}
      </Modal>
    </>
  )
}
