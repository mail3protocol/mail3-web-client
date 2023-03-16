import {
  BoxProps,
  Flex,
  Grid,
  Heading,
  Tab,
  Table,
  TableCaption,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useStyleConfig,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Spinner,
  Box,
  Icon,
} from '@chakra-ui/react'
import { Button as ButtonUI, IpfsModal } from 'ui'
import { Trans, useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import { isSupportedAddress } from 'shared'
import { useQuery } from 'react-query'
import { useAtomValue } from 'jotai'
import axios from 'axios'
import { ReactComponent as AdminIconSvg } from 'assets/svg/admin.svg'
import { Container } from '../components/Container'
import { TipsPanel } from '../components/TipsPanel'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useAPI } from '../hooks/useAPI'
import { QueryKey } from '../api/QueryKey'
import { userPropertiesAtom } from '../hooks/useLogin'
import { useToast } from '../hooks/useToast'
import { CloseButton } from '../components/ConfirmDialog'
import { useUpdateTipsPanel } from '../hooks/useUpdateTipsPanel'
import { ErrorCode } from '../api/ErrorCode'

export const UnbindLink: React.FC<{
  refetch?: () => void
  isAdmin?: boolean
  coAddr?: string
}> = ({ refetch, isAdmin, coAddr }) => {
  const { t } = useTranslation(['co_authors', 'common'])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const api = useAPI()
  const toast = useToast()

  const handleClose = () => {
    onClose()
  }

  const onSubmit = async () => {
    if (!coAddr) return
    setIsLoading(true)
    try {
      await api.unbindCollaborators(coAddr)
      toast(t('unbind_successfully'), {
        status: 'success',
        alertProps: { colorScheme: 'green' },
      })
      handleClose()
      if (refetch) refetch()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.status === 400 &&
          error?.response?.data.reason === ErrorCode.ADDRESS_INVALID
        )
          toast(t('bind_not_legitimate'), {
            status: 'error',
            alertProps: { colorScheme: 'red' },
          })
      }
    }
    setIsLoading(false)
  }

  return (
    <>
      <Button
        variant="link"
        color="primary.900"
        fontSize="12px"
        disabled={!isAdmin}
        onClick={onOpen}
      >
        {t('unbind')}
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent mt="30vh">
          <ModalHeader fontWeight="700" fontSize="18px" lineHeight="22px">
            {t('unbind_input_title')}
          </ModalHeader>
          <CloseButton top="16px" onClick={handleClose} />
          <ModalBody p="8px 20px">
            <Input
              border="none"
              value={coAddr}
              placeholder={t('bind_placeholder')}
              disabled
            />
            <Text fontWeight="500" fontSize="14px" lineHeight="20px" mt="8px">
              {t('unbind_input_text')}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              borderRadius="40px"
              colorScheme="red"
              w="138px"
              disabled={isLoading}
              onClick={onSubmit}
              isLoading={isLoading}
            >
              {t('confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export const BindButton: React.FC<{
  refetch: () => void
  disabled: boolean
}> = ({ refetch, disabled }) => {
  const { t } = useTranslation(['co_authors', 'common'])
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    isOpen: isOpenIpfsModal,
    onOpen: onOpenIpfsModal,
    onClose: onCloseIpfsModal,
  } = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState('')
  const api = useAPI()
  const toast = useToast()

  const {
    data: isUploadedIpfsKey,
    isLoading: isLoadingIsUploadedIpfsKeyState,
  } = useQuery(
    [QueryKey.GetMessageEncryptionKeyState],
    () =>
      api
        .getMessageEncryptionKeyState()
        .then((res) => res.data.state === 'set'),
    {
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const handleClose = () => {
    onClose()
    setAddress('')
  }

  const onBind = () => {
    if (!isUploadedIpfsKey) {
      onOpenIpfsModal()
    } else {
      onOpen()
    }
  }

  const onSubmit = async () => {
    if (!address) return
    setIsLoading(true)
    try {
      await api.bindCollaborators(address)
      toast(t('bind_successfully'), {
        status: 'success',
        alertProps: { colorScheme: 'green' },
      })
      handleClose()
      if (refetch) refetch()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.status === 400 &&
          error?.response?.data.reason ===
            ErrorCode.COMMUNITY_COLLABORATORS_ADDRESS_INVALID
        )
          toast(t('bind_bound'), {
            duration: 5000,
            status: 'error',
            alertProps: { colorScheme: 'red' },
          })

        if (
          error?.response?.status === 400 &&
          error?.response?.data.reason === ErrorCode.ADDRESS_INVALID
        )
          toast(t('bind_not_legitimate'), {
            duration: 5000,
            status: 'error',
            alertProps: { colorScheme: 'red' },
          })
      }
    }
    setIsLoading(false)
  }

  return (
    <>
      <Button
        variant="solid-rounded"
        colorScheme="primaryButton"
        fontSize="14px"
        w="175px"
        h="26px"
        mt="8px"
        isLoading={isLoadingIsUploadedIpfsKeyState}
        onClick={onBind}
        disabled={disabled || isLoadingIsUploadedIpfsKeyState}
      >
        {t('bind_title')}
      </Button>

      {!isLoadingIsUploadedIpfsKeyState ? (
        <IpfsModal
          isOpen={isOpenIpfsModal}
          isContent
          onClose={onCloseIpfsModal}
          isForceConnectWallet={!isUploadedIpfsKey}
          onAfterSignature={async (_, key) => {
            await api.updateMessageEncryptionKey(key)
            onCloseIpfsModal()
            onOpen()
          }}
        />
      ) : null}

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent mt="30vh">
          <ModalHeader fontWeight="700" fontSize="18px" lineHeight="22px">
            {t('bind_title')}
          </ModalHeader>
          <CloseButton top="16px" onClick={handleClose} />
          <ModalBody p="8px 20px">
            <Input
              border="none"
              value={address}
              placeholder={t('bind_placeholder')}
              onChange={({ target: { value } }) => setAddress(value)}
            />
            <Text
              color="primary.900"
              fontWeight="600"
              fontSize="14px"
              lineHeight="20px"
              mt="8px"
            >
              {t('bind_limit')}
            </Text>
          </ModalBody>

          <ModalFooter>
            <ButtonUI mr={3} onClick={handleClose} variant="outline" w="138px">
              {t('cancel')}
            </ButtonUI>
            <ButtonUI
              w="138px"
              disabled={!isSupportedAddress(address) || isLoading}
              onClick={onSubmit}
              isLoading={isLoading}
            >
              {t('bind')}
            </ButtonUI>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export const CoAuthors: React.FC = () => {
  useDocumentTitle('Members')
  const { t } = useTranslation(['co_authors', 'common'])
  const cardStyleProps = useStyleConfig('Card') as BoxProps
  const api = useAPI()
  const onUpdateTipsPanel = useUpdateTipsPanel()
  const userProps = useAtomValue(userPropertiesAtom) ?? {}

  const { data, isLoading, refetch } = useQuery(
    [QueryKey.GetCollaborators],
    async () => api.getCollaborators().then((r) => r.data),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      cacheTime: 0,
    }
  )

  useEffect(() => {
    onUpdateTipsPanel(
      <Trans
        i18nKey="help_text"
        t={t}
        components={{
          h3: <Heading as="h3" fontSize="16px" mt="32px" mb="12px" />,
          p: <Text fontSize="14px" fontWeight="400" color="#737373;" />,
        }}
      />
    )
  }, [])

  const isAdmin = useMemo(
    () =>
      data?.collaborators.some(
        (item) => item.is_administrator && item.address === userProps?.address
      ),
    [userProps, data]
  )

  const admin = data?.collaborators.find((i) => i.is_administrator)
  const bindList = data?.collaborators.filter((i) => !i.is_administrator) || []

  const EmptyCaption =
    bindList.length === 0 ? <TableCaption>{t('empty')}</TableCaption> : null

  return (
    <Container as={Grid} gridTemplateColumns="3fr 1fr" gap="20px">
      <Flex
        direction="column"
        align="center"
        {...cardStyleProps}
        w="full"
        h="full"
        p="32px"
      >
        <Flex justifyContent="space-between" w="full">
          <Heading fontSize="18px" lineHeight="20px">
            {t('title')}
          </Heading>
        </Flex>
        <Tabs w="full" variant="normal" mt="38px">
          <TabList>
            <Tab pl="0">{t('tabs.management')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p="32px 0">
              <Text fontWeight={500}>{t('management_text')}</Text>
              {isAdmin ? (
                <BindButton
                  refetch={() => refetch()}
                  disabled={bindList.length >= 3}
                />
              ) : null}
              <Box mt="32px">
                {bindList.length >= 3 ? (
                  <Text
                    mt="20px"
                    color="red"
                    fontWeight="400"
                    fontSize="12px"
                    lineHeight="16px"
                  >
                    {t('unbind_limit')}
                  </Text>
                ) : null}

                <TableContainer
                  mt="8px"
                  borderRadius="8px 8px 0px 0px"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="lineColor"
                >
                  <Table variant="unstyled">
                    {isLoading ? (
                      <TableCaption>
                        <Spinner />
                      </TableCaption>
                    ) : (
                      EmptyCaption
                    )}
                    <Thead>
                      <Tr>
                        <Th>{t('wallet_address')}</Th>
                        <Th>{t('operate')}</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {!isAdmin && admin ? (
                        <Tr>
                          <Td>
                            <Flex justifyItems="center" alignItems="center">
                              <Box>{admin.address}</Box>
                              <Icon
                                as={AdminIconSvg}
                                w="16px"
                                h="16px"
                                ml="6px"
                              />
                            </Flex>
                          </Td>
                          <Td>
                            <UnbindLink isAdmin={false} />
                          </Td>
                        </Tr>
                      ) : null}
                      {bindList.map(({ address }) => (
                        <Tr key={address}>
                          <Td>
                            <Flex justifyItems="center" alignItems="center">
                              <Box>{address}</Box>
                            </Flex>
                          </Td>
                          <Td>
                            <UnbindLink
                              refetch={refetch}
                              isAdmin={isAdmin}
                              coAddr={address}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <TipsPanel useSharedContent />
    </Container>
  )
}
