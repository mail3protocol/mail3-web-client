import {
  Box,
  BoxProps,
  Button,
  Center,
  Checkbox,
  Circle,
  Flex,
  Grid,
  Heading,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  SimpleGrid,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useStyleConfig,
} from '@chakra-ui/react'

import { Trans, useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import { Container } from '../components/Container'
import { TipsPanel } from '../components/TipsPanel'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useUpdateTipsPanel } from '../hooks/useUpdateTipsPanel'
import { useHelperComponent } from '../hooks/useHelperCom'
import { ReactComponent as UnlockSvg } from '../assets/ChatGPT/unlock.svg'
import { ReactComponent as LockSvg } from '../assets/ChatGPT/lock.svg'

const PRIMARY_LIST = [
  {
    label: 'English',
    id: 0,
  },
  {
    label: '中文(简)',
    id: 1,
  },
  {
    label: '日本语',
    id: 2,
  },
  {
    label: '한국인',
    id: 3,
  },
  {
    label: 'Français',
    id: 4,
  },
]

const TRANSLATE_LIST = [
  {
    label: 'English',
    id: 0,
  },
  {
    label: '中文',
    id: 1,
  },
  {
    label: '日本語',
    id: 2,
  },
  {
    label: '한국어',
    id: 3,
  },
  {
    label: 'français',
    id: 4,
  },
  {
    label: 'العربية',
    id: 5,
  },
  {
    label: 'español',
    id: 6,
  },
  {
    label: 'português',
    id: 7,
  },
  {
    label: 'Deutsch',
    id: 8,
  },
  {
    label: 'русский',
    id: 9,
  },
  {
    label: 'Bahasa Indonesia',
    id: 10,
  },
  {
    label: 'हिन्दी',
    id: 11,
  },
]

const lockProgressConfig = [
  {
    subscribers: 0,
    unlockNum: 0,
  },
  {
    subscribers: 10,
    unlockNum: 1,
  },
  {
    subscribers: 100,
    unlockNum: 2,
  },
  {
    subscribers: 500,
    unlockNum: 3,
  },
  {
    subscribers: 1000,
    unlockNum: 5,
  },
  {
    subscribers: 10000,
    unlockNum: 10,
  },
]

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

  const [checkMap, setCheckMap] = useState<{
    [key: string]: boolean
  }>({})
  const [isPartlock, setIsPartLock] = useState(false)
  const [primary, setPrimary] = useState('')
  const [maxSubscribers] = useState(99999)

  const curProgressData = useMemo(
    () =>
      lockProgressConfig.reduce(
        (acc, cur) => {
          if (cur.subscribers <= maxSubscribers) {
            return cur
          }
          return acc
        },
        {
          subscribers: 0,
          unlockNum: 0,
        }
      ),
    [maxSubscribers]
  )

  const maxQuotas = curProgressData.unlockNum

  const onChange = (isChecked: boolean, id: number) => {
    const newCheckMap: { [key: string]: boolean } = {
      ...checkMap,
      [id]: !isChecked,
    }

    const isLimitExhausted =
      Object.keys(newCheckMap).reduce(
        (count: number, key: string) =>
          count + (newCheckMap[key] === true ? 1 : 0),
        0
      ) >= maxQuotas

    if (isLimitExhausted) {
      setIsPartLock(true)
    } else {
      setIsPartLock(false)
    }
    setCheckMap(newCheckMap)
  }

  const onSubmit = () => {
    console.log(primary)
    console.log(checkMap)
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
                fontWeight="400"
                fontSize="12px"
                lineHeight="14px"
                color="secondaryTitleColor"
              >
                <Text>
                  {curProgressData.subscribers === 0
                    ? t('translation.english_unlocked')
                    : `${t('translation.unlock')}${curProgressData.unlockNum}`}
                </Text>
                <Text mt="4px">
                  {`${t('translation.subscribers')}: ${maxSubscribers}`}
                </Text>
              </Box>
              <Box
                background="#F2F2F2"
                borderRadius="100px"
                p="4px 8px"
                w="540px"
                mt="8px"
              >
                <Flex ml="-77px">
                  {lockProgressConfig.map((item, index) => {
                    const { subscribers, unlockNum } = item
                    const isActive = maxSubscribers >= subscribers
                    const isFirst = index === 0
                    return (
                      <Flex
                        w="104px"
                        position="relative"
                        key={subscribers}
                        justifyContent="flex-end"
                      >
                        {!isFirst ? (
                          <Box
                            position="absolute"
                            w="85px"
                            h="6px"
                            top="50%"
                            right="22px"
                            transform="translateY(-50%)"
                            bgColor={isActive ? 'primary.900' : 'previewBorder'}
                            zIndex={1}
                          />
                        ) : null}
                        <Popover arrowSize={8} trigger="hover" size="md">
                          <PopoverTrigger>
                            <Circle
                              size="24px"
                              bgColor={
                                isActive ? 'primary.900' : 'previewBorder'
                              }
                              zIndex={2}
                              position="relative"
                              cursor="pointer"
                            >
                              <Icon
                                as={isActive ? UnlockSvg : LockSvg}
                                w="12px"
                                h="12px"
                              />
                            </Circle>
                          </PopoverTrigger>

                          <PopoverContent width="auto" rounded="6px">
                            <PopoverArrow />
                            <PopoverBody
                              whiteSpace="nowrap"
                              fontSize="14px"
                              justifyContent="center"
                            >
                              <Box
                                fontWeight="400"
                                fontSize="12px"
                                lineHeight="14px"
                              >
                                <Text>
                                  {isFirst
                                    ? t('translation.english_unlocked')
                                    : `${t(
                                        'translation.unlock_quotas'
                                      )}${unlockNum}`}
                                </Text>
                                <Text mt="4px">
                                  {`${t(
                                    'translation.subscribers'
                                  )}: ${subscribers}
                                  `}
                                </Text>
                              </Box>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Flex>
                    )
                  })}
                </Flex>
              </Box>

              <Box mt="32px">
                <Text fontWeight="400" fontSize="14px" lineHeight="20px">
                  <Box display="inline" color="importantColor">
                    *
                  </Box>
                  {t('translation.primary')}
                </Text>
                <Text
                  fontWeight="400"
                  fontSize="12px"
                  lineHeight="16px"
                  color="secondaryTitleColor"
                >
                  {t('translation.primary_text')}
                </Text>

                <Box w="124px" mt="16px">
                  <Select
                    placeholder="Choose"
                    value={primary}
                    onChange={({ target: { value } }) => {
                      setPrimary(value)
                    }}
                  >
                    {PRIMARY_LIST.map((item) => {
                      const { label, id } = item
                      return (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      )
                    })}
                  </Select>
                </Box>
              </Box>

              <Box
                mt="32px"
                w="700px"
                p="8px 0"
                rounded="16px"
                border="1px solid"
                borderColor="previewBorder"
              >
                <Center
                  p="0 16px 8px"
                  borderBottom="1px solid"
                  borderColor="previewBorder"
                >
                  <Box fontWeight="510" fontSize="14px" lineHeight="20px">
                    {t('translation.more_language')}
                  </Box>
                  <Spacer />
                  <Box
                    fontWeight="400"
                    fontSize="12px"
                    lineHeight="16px"
                    color="importantColor"
                  >
                    {`${t('translation.language_quotas')}${maxQuotas}`}
                  </Box>
                </Center>

                <SimpleGrid
                  p="40px 20px 30px"
                  spacing="20px"
                  minChildWidth="80px"
                >
                  {TRANSLATE_LIST.map((item, index) => {
                    const { id, label } = item
                    const isChecked = checkMap[id]
                    const isFirstItem = !index
                    const isLock = !maxQuotas

                    return (
                      <Checkbox
                        key={id}
                        isDisabled={
                          isLock || isFirstItem || (!isChecked && isPartlock)
                        }
                        isChecked={isFirstItem || isChecked!}
                        onChange={() => onChange(isChecked, id)}
                      >
                        {label}
                      </Checkbox>
                    )
                  })}
                </SimpleGrid>
              </Box>

              <Button
                mt="32px"
                variant="solid-rounded"
                colorScheme="primaryButton"
                type="submit"
                // isLoading={isUpdating}
                onClick={onSubmit}
                isDisabled={!primary}
              >
                {t('translation.update')}
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <TipsPanel useSharedContent />
    </Container>
  )
}
