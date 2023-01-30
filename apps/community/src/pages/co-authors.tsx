import {
  BoxProps,
  Flex,
  Grid,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
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
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <TipsPanel useSharedContent />
    </Container>
  )
}
