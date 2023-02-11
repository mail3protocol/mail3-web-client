import {
  Box,
  Center,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { noop, PromiseObj } from 'hooks'
import { atom, useAtomValue } from 'jotai'
import { selectAtom, useUpdateAtom } from 'jotai/utils'
import { useCallback, useState } from 'react'
import { ReactComponent as SvgDiamond } from 'assets/subscribe-page/diamond.svg'
import { ReactComponent as SvgDiamondOk } from 'assets/subscribe-page/diamond-success.svg'
import { Trans, useTranslation } from 'react-i18next'
import { truncateAddress } from 'shared'
import { Button } from 'ui'
import { useQuery } from 'react-query'
import { Query } from '../api/query'
import { useAPI } from './useAPI'

const fnSelector = (a: PromiseObj) => a.fn

export interface BuyPremiumDialogOptions {
  addr?: string
  suffixName?: string
  uuid?: string
  nickname?: string
}

const openAtom = atom(false)
const loadingAtom = atom(false)
const isBuySuccessAtom = atom(false)
const onCloseObjAtom = atom<PromiseObj>({ fn: noop })
const optionsAtom = atom<BuyPremiumDialogOptions>({})
const onCloseAtom = selectAtom(onCloseObjAtom, fnSelector)

export const useBuyPremiumModel = () => {
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
    async ({ onClose, ...options }) => {
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

const BuyIframe: React.FC<{ suffixName?: string }> = ({ suffixName }) => {
  const iframeSrc = `https://dev.daodid.id/frame/?bit=${suffixName}&theme=light`
  const [loading, setLoading] = useState(true)

  const onload = () => {
    setLoading(false)
  }

  return (
    <Center mt="8px" position="relative">
      <iframe
        src={iframeSrc}
        onLoad={onload}
        title="daodid"
        width="504"
        height="190"
      />
      {loading ? (
        <Center position="absolute" top="0" left="0" w="full" h="full">
          <Spinner />
        </Center>
      ) : null}
    </Center>
  )
}

export const BuySuccess: React.FC = () => {
  const [t] = useTranslation(['subscription-article'])
  const { options } = useBuyPremiumModel()
  // notifications
  // check
  // no await notifications
  // refresh web
  // yes, continue refresh web

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

      <Text
        mt="16px"
        fontWeight="300"
        fontSize="12px"
        lineHeight="16px"
        textAlign="center"
      >
        {t('notifications')}
      </Text>

      <Button mt="16px">{t('continue')}</Button>
    </Center>
  )
}

export const BuyForm: React.FC<{ addr?: string; suffixName?: string }> = ({
  addr,
  suffixName,
}) => {
  const [t] = useTranslation(['subscription-article'])
  const api = useAPI()
  const { options } = useBuyPremiumModel()
  const setIsBuySuccess = useUpdateAtom(isBuySuccessAtom)
  // interval buy ok
  useQuery(
    [Query.GetCheckPremiumMember],
    async () => {
      try {
        await api.checkPremiumMember(options?.uuid ?? '')
        return true
      } catch (error) {
        return false
      }
    },
    {
      enabled: !!options?.uuid,
      retry: 0,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: 3000,
      onSuccess(d) {
        if (d) {
          setIsBuySuccess(true)
          // set buy ok
        } else {
          setIsBuySuccess(true)
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

      <BuyIframe suffixName={suffixName} />
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
  const { options, isOpen, onClose, isBuySuccess } = useBuyPremiumModel()

  const { addr, suffixName } = options

  const handleClose = () => {
    if (isBuySuccess) {
      // refetch
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent p="0" maxW={isBuySuccess ? '305px' : '548px'}>
        <ModalCloseButton />
        <ModalBody p="0">
          {isBuySuccess ? (
            <BuySuccess />
          ) : (
            <BuyForm addr={addr} suffixName={suffixName} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
