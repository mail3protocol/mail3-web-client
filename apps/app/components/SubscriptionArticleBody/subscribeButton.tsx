import {
  Center,
  Spinner,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useDialog, useToast } from 'hooks'
import { useAccount } from 'connect-wallet'
import { RewardType } from 'models'
import {
  ComponentType,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Query } from '../../api/query'
import { useAPI } from '../../hooks/useAPI'
import { SubscribeButtonView } from './subscribeButtonView'

import type { SubscribeProps } from '../Subscribe'
import { useIsAuthenticated } from '../../hooks/useLogin'

const DynamicSimpleSubscribePage: ComponentType<SubscribeProps> = dynamic(
  () =>
    import('../../csr_pages/subscribe').then(
      (mod) => mod.SimpleSubscribePage
    ) as any,
  {
    ssr: false,
    suspense: false,
    loading: () => (
      <Center w="100%" h="100%">
        <Spinner />
      </Center>
    ),
  }
)

export interface SubscribeButtonProps {
  rewardType?: RewardType
  uuid: string
  setIsHidden?: Dispatch<SetStateAction<boolean>>
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  rewardType,
  uuid,
  setIsHidden,
}) => {
  const [t] = useTranslation('subscription')
  const isAuth = useIsAuthenticated()
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

  useEffect(() => {
    setIsLoading(isLoadingStatus)
  }, [isLoadingStatus])

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
          isLoading={isLoading}
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
            {isOpen ? (
              <DynamicSimpleSubscribePage
                isDialog
                uuid={uuid}
                rewardType={rewardType}
              />
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SubscribeButton
