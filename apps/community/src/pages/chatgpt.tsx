import {
  Box,
  BoxProps,
  Checkbox,
  Flex,
  Grid,
  Heading,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UnorderedList,
  useStyleConfig,
} from '@chakra-ui/react'

import { Trans, useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Container } from '../components/Container'
import { TipsPanel } from '../components/TipsPanel'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useUpdateTipsPanel } from '../hooks/useUpdateTipsPanel'
import { useHelperComponent } from '../hooks/useHelperCom'

export const ChatGPT: React.FC = () => {
  useDocumentTitle('ChatGPT Bot')
  const { t } = useTranslation(['chatgpt', 'common'])
  const cardStyleProps = useStyleConfig('Card') as BoxProps
  const onUpdateTipsPanel = useUpdateTipsPanel()
  const helperCom = useHelperComponent()

  useEffect(() => {
    onUpdateTipsPanel(
      <Trans i18nKey="translation.helper_text" t={t} components={helperCom} />
    )
  }, [])

  const maxLanguegeCount = 2

  const data = [
    {
      id: 1,
      name: '1',
      disableForever: true,
    },
    {
      id: 2,
      name: '1',
    },
    {
      id: 3,
      name: '1',
    },

    {
      id: 4,
      name: '1',
    },
  ]

  const [map, setMap] = useState<{
    [key: string]: boolean
  }>({
    1: true,
  })

  const [islock, setIsLock] = useState(false)
  const [isPartlock, setIsPartLock] = useState(false)

  const onChange = (isChecked: boolean, id: number) => {
    const newCheckMap: { [key: string]: boolean } = { ...map, [id]: !isChecked }

    const isLimitExhausted =
      Object.keys(newCheckMap).reduce(
        (count: number, key: string) =>
          count + (newCheckMap[key] === true ? 1 : 0),
        0
      ) >= maxLanguegeCount

    if (isLimitExhausted) {
      setIsPartLock(true)
    } else {
      setIsPartLock(false)
    }
    setMap(newCheckMap)
  }

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
            <Tab pl="0">{t('tabs.translation')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p="32px 0">
              <Box
                p="5px 8px"
                background="containerBackground"
                borderRadius="8px"
                fontWeight={300}
              >
                <Trans
                  i18nKey="translation.reach_text"
                  t={t}
                  components={{
                    ul: <UnorderedList />,
                    li: <ListItem fontSize="8px" lineHeight="0" />,
                    text: <Text fontSize="12px" lineHeight="18px" />,
                  }}
                />
              </Box>
              {data.map((item) => {
                const { id, name } = item
                const isChecked = map[id]
                return (
                  <Checkbox
                    key={id}
                    isDisabled={islock || (!isChecked && isPartlock)}
                    isChecked={isChecked!}
                    onChange={() => onChange(isChecked, id)}
                  >
                    {name}
                  </Checkbox>
                )
              })}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <TipsPanel useSharedContent />
    </Container>
  )
}
