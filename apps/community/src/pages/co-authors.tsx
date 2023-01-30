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
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Container } from '../components/Container'
import { TipsPanel } from '../components/TipsPanel'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export const CoAuthors: React.FC = () => {
  useDocumentTitle('Co-authors')
  const { t } = useTranslation(['co_authors', 'common'])
  const cardStyleProps = useStyleConfig('Card') as BoxProps

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
