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
} from '@chakra-ui/react'

import { Button as ButtonUI } from 'ui'
import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import { isSupportedAddress } from 'shared'
import { useQuery } from 'react-query'
import { useAtomValue } from 'jotai'
import axios from 'axios'
import { Container } from '../components/Container'
import { TipsPanel } from '../components/TipsPanel'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useAPI } from '../hooks/useAPI'
import { QueryKey } from '../api/QueryKey'
import { userPropertiesAtom } from '../hooks/useLogin'
import { useToast } from '../hooks/useToast'
import { CloseButton } from '../components/ConfirmDialog'

export const UnbindLink: React.FC<{
  refetch: () => void
  isAdmin?: boolean
  coAddr: string
}> = ({ refetch, isAdmin, coAddr }) => {
  const { t } = useTranslation(['co_authors', 'common'])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState('')
  const api = useAPI()
  const toast = useToast()

  const onSubmit = async () => {
    if (address) {
      setIsLoading(true)
      try {
        await api.unbindCollaborators(address)
        toast(t('unbind_successfully'), {
          status: 'success',
          alertProps: { colorScheme: 'green' },
        })
        onClose()
        setAddress('')
        if (refetch) refetch()
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (
            error?.response?.status === 400 &&
            error?.response?.data.reason === 'ADDRESS_INVALID'
          )
            toast(t('bind_not_legitimate'), {
              status: 'error',
              alertProps: { colorScheme: 'red' },
            })
        }
      }
      setIsLoading(false)
    }
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
        {t('Unbind')}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mt="30vh">
          <ModalHeader fontWeight="700" fontSize="18px" lineHeight="22px">
            {t('unbind_input_title')}
          </ModalHeader>
          <CloseButton top="16px" onClick={onClose} />
          <ModalBody p="8px 20px">
            <Input
              border="none"
              value={address}
              placeholder={t('bind_pleaceholder')}
              onChange={({ target: { value } }) => setAddress(value)}
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
              disabled={address !== coAddr || isLoading}
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

export const BindButton: React.FC<{ refetch: () => void }> = ({ refetch }) => {
  const { t } = useTranslation(['co_authors', 'common'])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState('')
  const api = useAPI()
  const toast = useToast()

  const onSubmit = async () => {
    if (address) {
      setIsLoading(true)
      try {
        await api.bindCollaborators(address)
        toast(t('bind_successfully'), {
          status: 'success',
          alertProps: { colorScheme: 'green' },
        })
        onClose()
        setAddress('')
        if (refetch) refetch()
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (
            error?.response?.status === 400 &&
            error?.response?.data.reason ===
              'COMMUNITY_COLLABORATORS_ADDRESS_INVALID'
          )
            toast(t('bind_bound'), {
              status: 'error',
              alertProps: { colorScheme: 'red' },
            })

          if (
            error?.response?.status === 400 &&
            error?.response?.data.reason === 'ADDRESS_INVALID'
          )
            toast(t('bind_not_legitimate'), {
              status: 'error',
              alertProps: { colorScheme: 'red' },
            })
        }
      }
      setIsLoading(false)
    }
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
        onClick={onOpen}
      >
        {t('bind_title')}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mt="30vh">
          <ModalHeader fontWeight="700" fontSize="18px" lineHeight="22px">
            {t('bind_title')}
          </ModalHeader>
          <CloseButton top="16px" onClick={onClose} />
          <ModalBody p="8px 20px">
            <Input
              border="none"
              value={address}
              placeholder={t('bind_pleaceholder')}
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
            <ButtonUI mr={3} onClick={onClose} variant="outline" w="138px">
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
  useDocumentTitle('Co-authors')
  const { t } = useTranslation(['co_authors', 'common'])
  const cardStyleProps = useStyleConfig('Card') as BoxProps
  const api = useAPI()
  const userProps = useAtomValue(userPropertiesAtom)

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

  const isAdmin = useMemo(
    () =>
      data?.collaborators.some(
        (item) => item.is_administrator && item.address === userProps.address
      ),
    [userProps, data]
  )

  const isEmpty =
    data?.collaborators.filter((i) => !i.is_administrator).length === 0

  const EmptyCaption = isEmpty ? (
    <TableCaption>{t('empty')}</TableCaption>
  ) : null

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
            <Tab>{t('tabs.management')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p="32px 0">
              <Text fontWeight={500}>{t('management_text')}</Text>
              <BindButton refetch={() => refetch()} />

              <TableContainer
                mt="32px"
                borderRadius="8px 8px 0px 0px"
                overflow="hidden"
                border="1px solid #F2F2F2"
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
                      <Th>{t('state')}</Th>
                      <Th>{t('operate')}</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {data?.collaborators.map((item) => {
                      const { address, is_administrator: isAdminRemote } = item
                      if (isAdmin && isAdminRemote) {
                        return null
                      }

                      return (
                        <Tr key={address}>
                          <Td>
                            {address}
                            {isAdminRemote ? '!admin' : ''}
                          </Td>
                          <Td>{t('bound')}</Td>
                          <Td>
                            <UnbindLink
                              refetch={refetch}
                              isAdmin={isAdmin}
                              coAddr={address}
                            />
                          </Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <TipsPanel useSharedContent />
    </Container>
  )
}
