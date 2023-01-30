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
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
} from '@chakra-ui/react'

import { Button as ButtonUI } from 'ui'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { isSupportedAddress } from 'shared'
import { useQuery } from 'react-query'
import { Container } from '../components/Container'
import { TipsPanel } from '../components/TipsPanel'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useAPI } from '../hooks/useAPI'
import { QueryKey } from '../api/QueryKey'

export const BindButton: React.FC = () => {
  const { t } = useTranslation(['co_authors', 'common'])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [address, setAddress] = useState('')

  const onSubmit = () => {
    console.log(address)
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
        <ModalContent>
          <ModalHeader>{t('bind_title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
              disabled={!isSupportedAddress(address)}
              onClick={onSubmit}
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

  const { data, isLoading, refetch } = useQuery(
    [QueryKey.GetCollaborators],
    async () => api.getCollaborators().then((r) => r.data),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      cacheTime: 0,
      onSuccess(res) {
        console.log(res)
      },
    }
  )

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
              <BindButton />

              <TableContainer
                mt="32px"
                borderRadius="8px 8px 0px 0px"
                overflow="hidden"
                border="1px solid #F2F2F2"
              >
                <Table variant="unstyled">
                  <TableCaption>{t('empty')}</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>{t('wallet_address')}</Th>
                      <Th>{t('state')}</Th>
                      <Th>{t('operate')}</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {/* <Tr>
                      <Td>inches</Td>
                      <Td>millimetres (mm)</Td>
                      <Td>25.4</Td>
                    </Tr>
                    <Tr>
                      <Td>inches</Td>
                      <Td>millimetres (mm)</Td>
                      <Td>25.4</Td>
                    </Tr>
                    <Tr>
                      <Td>inches</Td>
                      <Td>millimetres (mm)</Td>
                      <Td>25.4</Td>
                    </Tr> */}
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
