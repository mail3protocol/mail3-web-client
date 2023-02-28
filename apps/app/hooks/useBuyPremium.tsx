import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Skeleton,
  Spinner,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { noop, PromiseObj } from 'hooks'
import { atom, useAtom, useAtomValue } from 'jotai'
import { selectAtom, useUpdateAtom } from 'jotai/utils'
import { useCallback, useEffect } from 'react'
import { ReactComponent as SvgDiamond } from 'assets/subscribe-page/diamond.svg'
import { ReactComponent as SvgDiamondOk } from 'assets/subscribe-page/diamond-success.svg'
import { Trans, useTranslation } from 'react-i18next'
import { truncateAddress } from 'shared'
import { Button } from 'ui'
import { useQuery } from 'react-query'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { Query } from '../api/query'
import { useAPI } from './useAPI'
import { useNotification } from './useNotification'

const fnSelector = (a: PromiseObj) => a.fn

const Daodid = dynamic(() => import('../components/DaodidComponent'), {
  ssr: false,
  loading: () => <Skeleton w="full" h="full" />,
})

export interface BuyPremiumDialogOptions {
  addr?: string
  bitAccount?: string
  uuid?: string
  nickname?: string
  onClose?: () => void
  refetch?: () => void
}

const openAtom = atom(false)
const loadingAtom = atom(false)
const isBuySuccessAtom = atom(false)
const onCloseObjAtom = atom<PromiseObj>({ fn: noop })
const optionsAtom = atom<BuyPremiumDialogOptions>({})
const onCloseAtom = selectAtom(onCloseObjAtom, fnSelector)

interface GetAuthingLevelRes {
  err_no: number
  err_msg: string
  data: {
    sAddress: string
    sAccount: string
    authing: number
    role: 'no_auth' | 'waiting_room' | 'subscriber' | 'owner'
  }
}

export const getAuthingLevel = (sAccount: string, sAddress: string) =>
  axios.get<GetAuthingLevelRes>(
    `https://daodid.id/api/authing/check?sAccount=${sAccount}&sAddress=${sAddress}`
  )

export const useBuyPremiumModel = (): {
  isOpen: boolean
  options: BuyPremiumDialogOptions
  isLoading: boolean
  onClose: () => void
  isBuySuccess: boolean
} => {
  const isOpen = useAtomValue(openAtom)
  const options = useAtomValue(optionsAtom)
  const isLoading = useAtomValue(loadingAtom)
  const onClose = useAtomValue(onCloseAtom)
  const isBuySuccess = useAtomValue(isBuySuccessAtom)

  return {
    isOpen,
    options,
    isLoading,
    onClose,
    isBuySuccess,
  }
}

export const useBuyPremium = () => {
  const setOptions = useUpdateAtom(optionsAtom)
  const setIsOpen = useUpdateAtom(openAtom)
  const setIsLoading = useUpdateAtom(loadingAtom)
  const setOnClose = useUpdateAtom(onCloseObjAtom)

  const callback = useCallback(
    async ({ onClose, ...options }: BuyPremiumDialogOptions) => {
      setOptions(options)
      setIsOpen(true)
      setOnClose({
        fn: async () => {
          setIsOpen(false)
          onClose?.()
        },
      })
    },
    [setOptions, setIsOpen, setIsLoading, setOnClose]
  )

  return callback
}

const BuyIframe: React.FC<{ bitAccount: string; isPaying?: boolean }> = ({
  bitAccount,
  isPaying,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  return (
    <Center
      mt="8px"
      position="relative"
      overflow="hidden"
      transform={
        isMobile
          ? `scale(${Math.min(1, (window.innerWidth / 504) * 0.95)})`
          : 'none'
      }
    >
      <Box w="440px" h="195px">
        <Daodid bitAccount={bitAccount} />
      </Box>
      {isPaying ? (
        <Center
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          zIndex={3}
          backdropFilter="blur(3px)"
        >
          <Box
            fontWeight="400"
            fontSize="14px"
            lineHeight="16px"
            color="#333"
            mr="5px"
          >
            May take 1-3 minutes
          </Box>
          <Spinner />
        </Center>
      ) : null}
    </Center>
  )
}

export const BuySuccess: React.FC = () => {
  const [t] = useTranslation(['subscription-article'])
  const { options, onClose } = useBuyPremiumModel()
  const { permission, openNotification } = useNotification(false)
  const isMobile = useBreakpointValue({ base: true, md: false })

  const reload = () => {
    options?.refetch?.()
    onClose?.()
  }

  useEffect(() => {
    if (permission !== 'default') {
      return
    }
    const callNotification = async () => {
      await openNotification()
      reload()
    }
    callNotification()
  }, [permission])

  return (
    <Center flexDirection="column" p="32px">
      <Icon as={SvgDiamondOk} w="48px" h="48px" />
      <Text
        mt="10px"
        fontWeight="500"
        fontSize="14px"
        lineHeight="20px"
        color="#000"
        textAlign="center"
      >
        <Trans
          components={{
            b: (
              <Box as="span" color="#4E51F4" fontSize="16px" fontWeight={700} />
            ),
          }}
          values={{ name: options?.nickname }}
          i18nKey="buy-ok"
          t={t}
        />
      </Text>

      {permission !== 'granted' || isMobile ? (
        <Text
          mt="16px"
          fontWeight="300"
          fontSize="12px"
          lineHeight="16px"
          textAlign="center"
        >
          {t('notifications')}
        </Text>
      ) : null}

      <Button mt="16px" onClick={reload}>
        {t('continue')}
      </Button>
    </Center>
  )
}

export const BuyForm: React.FC = () => {
  const [t] = useTranslation(['subscription-article'])
  const api = useAPI()
  const { options } = useBuyPremiumModel()
  const [, setIsBuySuccess] = useAtom(isBuySuccessAtom)
  const bitAccount = options?.bitAccount ?? ''
  const uuid = options?.uuid ?? ''
  const addr = options?.addr ?? ''

  useQuery(
    [Query.GetCheckPremiumMember, 'interval buy', bitAccount, uuid],
    async () => {
      try {
        await api.checkPremiumMember(uuid)
        return true
      } catch (error) {
        // return true
        return false
      }
    },
    {
      enabled: !!bitAccount && !!addr,
      retry: 0,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: 3000,
      onSuccess(d) {
        if (d) {
          setIsBuySuccess(true)
          api.SubscriptionCommunityUserFollowing(uuid).catch()
        }
      },
    }
  )

  return (
    <Center flexDirection="column" p="32px 0">
      <Center>
        <Icon as={SvgDiamond} w="32px" h="32px" />
        <Box ml="8px" fontWeight="700" fontSize="20px" lineHeight="32px">
          {t('buy-title')}
        </Box>
      </Center>
      <Center
        mt="15px"
        fontWeight="400"
        fontSize="14px"
        lineHeight="16px"
        color="#868686"
      >
        {t('powered-by')}
      </Center>
      <Center
        mt="8px"
        fontWeight="500"
        fontSize="16px"
        lineHeight="20px"
        color="#333"
      >
        {t('sub-domain')}
      </Center>
      <BuyIframe bitAccount={bitAccount} />
      <Center mt="24px" fontWeight="400" fontSize="12px" color="#FF6B00">
        {t('wallet')}
      </Center>
      <Center
        mt="10px"
        background="#F2F2F2"
        borderRadius="200px;"
        fontWeight="500"
        fontSize="14px"
        color="#737373"
        padding="4px 32px"
      >
        {truncateAddress(addr ?? '')}
      </Center>
    </Center>
  )
}

export const BuyPremiumDialog: React.FC = () => {
  const { isOpen, onClose, isBuySuccess, options } = useBuyPremiumModel()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const reload = () => {
    options?.refetch?.()
  }

  const handleClose = () => {
    if (isBuySuccess) {
      reload()
    }
    onClose()
  }

  if (isMobile) {
    return (
      <Drawer placement="bottom" onClose={handleClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent borderRadius="32px 32px 0px 0px">
          <DrawerCloseButton />
          <DrawerBody>{isBuySuccess ? <BuySuccess /> : <BuyForm />}</DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent
        p="0"
        maxW={isBuySuccess ? '305px' : '548px'}
        borderRadius="32px"
      >
        <ModalCloseButton />
        <ModalBody p="0">
          {isBuySuccess ? <BuySuccess /> : <BuyForm />}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
