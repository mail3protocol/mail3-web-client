import {
  useToast as useChakraToast,
  HStack,
  Box,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useDialog } from 'hooks'
import { QueryKey } from '../api/QueryKey'
import { useCheckAdminStatus, useIsAdmin } from './useAdmin'
import { useAPI } from './useAPI'
import { useToast } from './useToast'
import { ReactComponent as SyncSvg } from '../assets/SyncIcon.svg'

export const useSwitchMirror = () => {
  const isAdmin = useIsAdmin()
  const rawToast = useChakraToast()
  const toast = useToast()
  const api = useAPI()
  const {
    data: isUploadedIpfsKey,
    isLoading: isLoadingIsUploadedIpfsKeyState,
  } = useQuery([QueryKey.GetMessageEncryptionKeyState], () =>
    api.getMessageEncryptionKeyState().then((res) => res.data.state === 'set')
  )
  const { t } = useTranslation(['dashboard', 'common'])
  const { isLoading: isCheckAdminStatusLoading } = useCheckAdminStatus()
  const {
    isOpen: isOpenIpfsModal,
    onOpen: onOpenIpfsModal,
    onClose: onCloseIpfsModal,
  } = useDisclosure()
  const dialog = useDialog()

  const switchMirrorOnProgress = () => {
    rawToast.closeAll()
    rawToast({
      duration: 3000,
      position: 'top',
      render() {
        return (
          <HStack
            spacing="12px"
            padding="12px 16px"
            borderRadius="20px"
            bg="white"
            boxShadow="0px 0px 10px 4px rgb(25 25 100 / 10%)"
          >
            <Box>
              <SyncSvg style={{ position: 'relative', top: '-10px' }} />
            </Box>
            <Flex direction="column">
              <Text fontWeight="bold" fontSize="16px">
                {t('mirror.importing')}
              </Text>
              <Text fontSize="14px">{t('mirror.toast')}</Text>
            </Flex>
          </HStack>
        )
      },
    })
  }

  const switchMirror = async () => {
    try {
      await api.switchFromMirror()
      switchMirrorOnProgress()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.reason === 'COMMUNITY_POST_SYNC_EVENT_OCCUPIED'
        ) {
          switchMirrorOnProgress()
        } else if (error?.response?.status === 404) {
          toast(t('mirror.not_found'))
        } else {
          toast(error?.response?.data?.message || error?.message)
        }
      }
    }
  }

  const switchMirrorOnClick = () => {
    if (isLoadingIsUploadedIpfsKeyState || isCheckAdminStatusLoading) {
      return
    }
    if (!isAdmin) {
      toast(t('mirror.not_allow'))
      return
    }
    dialog({
      title: t('switch_from_mirror'),
      description: (
        <>
          <Text fontWeight={600}>{t('mirror.sub_title')}</Text>
          <Text color="#4E51F4" mt="24px" fontWeight={400} fontSize="15px">
            {t('mirror.desc')}
          </Text>
        </>
      ),
      okText: t('mirror.import'),
      async onConfirm() {
        if (!isUploadedIpfsKey) {
          onOpenIpfsModal()
        } else {
          await switchMirror()
        }
      },
    })
  }

  return {
    switchMirrorOnClick,
    isOpenIpfsModal,
    onCloseIpfsModal,
    isUploadedIpfsKey,
    isLoadingIsUploadedIpfsKeyState,
    switchMirror,
    onOpenIpfsModal,
    isCheckAdminStatusLoading,
  }
}
