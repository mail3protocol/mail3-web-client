import {
  Box,
  Button,
  Center,
  Circle,
  CloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { atom, useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { ReactComponent as SvgBell } from 'assets/subscribe-page/bell.svg'
import { useQuery } from 'react-query'
import { useAccount } from 'hooks'
import { useNotification } from '../../hooks/useNotification'
import { GifGuideDialog } from '../NotificationSwitch/GifGuideDialog'
import { Query } from '../../api/query'
import { useAPI } from '../../hooks/useAPI'
import { useIsAuthenticated } from '../../hooks/useLogin'

export const NotificationBarIsOpenAtom = atom(false)

export const NotificationBar: React.FC<{ uuid: string }> = ({ uuid }) => {
  const [t] = useTranslation('subscription-article')
  const api = useAPI()
  const account = useAccount()
  const isAuth = useIsAuthenticated()
  const [isOpen, setIsOpen] = useAtom(NotificationBarIsOpenAtom)

  const {
    isOpen: isOpenGifGuideDialog,
    onOpen: onOpenGifGuideDialog,
    onClose: onCloseGifGuideDialog,
  } = useDisclosure()
  const { permission, openNotification } = useNotification(false)

  useQuery(
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
      onSuccess({ state }) {
        if (state === 'active' && permission !== 'granted') setIsOpen(true)
      },
      enabled: !!uuid && isAuth,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const onEnable = async () => {
    if (permission === 'denied') {
      onOpenGifGuideDialog()
      return
    }
    if ((await openNotification()) === 'granted') setIsOpen(false)
  }

  return (
    <Box display={{ base: 'none', md: 'block' }}>
      {isOpen ? (
        <Center w="full" bgColor="#4E51F4" h="40px">
          <Center
            maxW="800px"
            w="full"
            fontWeight="400"
            fontSize="16px"
            lineHeight="20px"
            color="#fff"
            position="relative"
          >
            <SvgBell />
            <Box ml="16px">{t('notifications')}</Box>
            <Button
              variant="outline"
              h="24px"
              ml="16px"
              _active={{
                bgColor: 'transparent',
                opacity: 0.6,
              }}
              _hover={{
                bgColor: 'transparent',
                opacity: 0.8,
              }}
              onClick={onEnable}
            >
              {t('enable')}
            </Button>

            <Box
              as={Circle}
              position="absolute"
              right="0"
              top="50%"
              transform="translateY(-50%)"
              border="2px solid #fff"
              w="24px"
              h="24px"
            >
              <CloseButton onClick={() => setIsOpen(false)} />
            </Box>
          </Center>
        </Center>
      ) : null}
      <GifGuideDialog
        isOpen={isOpenGifGuideDialog}
        onClose={onCloseGifGuideDialog}
      />
    </Box>
  )
}
