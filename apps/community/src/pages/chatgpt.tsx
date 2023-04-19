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
  Spinner,
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
import { useQuery } from 'react-query'
import axios from 'axios'
import { Container } from '../components/Container'
import { TipsPanel } from '../components/TipsPanel'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useUpdateTipsPanel } from '../hooks/useUpdateTipsPanel'
import { useHelperComponent } from '../hooks/useHelperCom'
import { ReactComponent as UnlockSvg } from '../assets/ChatGPT/unlock.svg'
import { ReactComponent as LockSvg } from '../assets/ChatGPT/lock.svg'
import { useAPI } from '../hooks/useAPI'
import { QueryKey } from '../api/QueryKey'
import { useToast } from '../hooks/useToast'
import { ErrorCode } from '../api/ErrorCode'

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

const DEFAULT_LANGUAGE_SUPPORT = 'en'

export const ChatGPT: React.FC = () => {
  useDocumentTitle('ChatGPT Bot')
  const { t } = useTranslation(['chatgpt', 'common'])
  const cardStyleProps = useStyleConfig('Card') as BoxProps
  const onUpdateTipsPanel = useUpdateTipsPanel()
  const helperCom = useHelperComponent()
  const api = useAPI()
  const toast = useToast()

  const [checkMap, setCheckMap] = useState<{
    [key: string]: boolean
  }>({
    [DEFAULT_LANGUAGE_SUPPORT]: true,
  })
  const [primary, setPrimary] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: langCodes } = useQuery(
    [QueryKey.GetLangCodes],
    async () => {
      const { data } = await api.getLanguageCode()
      return data.languages
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      cacheTime: 0,
    }
  )

  const { data: settingInfo } = useQuery(
    [QueryKey.GetTranslationSetting],
    async () => {
      const { data } = await api.getTranslationSetting()
      return data
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      cacheTime: 0,
      onSuccess(d) {
        setPrimary(d.primary_language.language_code)
        setCheckMap(
          d.languages.reduce(
            (acc, item) => ({
              ...acc,
              [item.language_code]: true,
            }),
            {}
          )
        )
      },
    }
  )

  useEffect(() => {
    onUpdateTipsPanel(
      <Trans i18nKey="translation.helper_text" t={t} components={helperCom} />
    )
  }, [])

  const maxSubscribers = settingInfo?.subscribers_count || 0
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

  const onChange = (isChecked: boolean, id: string) => {
    const newCheckMap: { [key: string]: boolean } = {
      ...checkMap,
      [id]: !isChecked,
    }
    setCheckMap(newCheckMap)
  }

  const isExhausted = useMemo(
    () =>
      Object.keys(checkMap).reduce((count: number, key: string) => {
        if (key === DEFAULT_LANGUAGE_SUPPORT) return count
        return count + (checkMap[key] === true ? 1 : 0)
      }, 0) >= maxQuotas,
    [checkMap, maxQuotas]
  )

  const onSubmit = async () => {
    setIsUpdating(true)
    try {
      const languageCodes = Object.keys(checkMap).filter((key) => checkMap[key])
      await api.updateTranslationSetting(
        primary,
        languageCodes.includes(DEFAULT_LANGUAGE_SUPPORT)
          ? languageCodes
          : [...languageCodes, DEFAULT_LANGUAGE_SUPPORT]
      )
      toast(t('translation.update_successful'), {
        status: 'success',
        alertProps: { colorScheme: 'green' },
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.status === 400 &&
          error?.response?.data.reason ===
            ErrorCode.TRANSLATION_LANGUAGE_QUOTA_EXCEEDED
        ) {
          toast(error?.response?.data.message, {
            duration: 5000,
            status: 'error',
            alertProps: { colorScheme: 'red' },
          })
          return
        }
        if (error?.response?.status === 400) {
          toast(t('translation.update_failed'), {
            duration: 5000,
            status: 'error',
            alertProps: { colorScheme: 'red' },
          })
        }
      }
    }
    setIsUpdating(false)
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
                  {langCodes ? (
                    <Select
                      placeholder={!primary ? 'Choose' : ''}
                      value={primary}
                      onChange={({ target: { value } }) => {
                        setPrimary(value)
                      }}
                    >
                      {langCodes.map((item) => {
                        const { language, language_code: code } = item
                        return (
                          <option key={code} value={code}>
                            {language}
                          </option>
                        )
                      })}
                    </Select>
                  ) : null}
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

                {langCodes ? (
                  <SimpleGrid
                    p="40px 20px 30px"
                    spacing="20px"
                    minChildWidth="80px"
                  >
                    {langCodes.map((item) => {
                      const { language_code: code, language } = item
                      const isChecked = checkMap[code]
                      const isLock = !maxQuotas

                      return (
                        <Checkbox
                          key={code}
                          isDisabled={
                            isLock ||
                            code === DEFAULT_LANGUAGE_SUPPORT ||
                            (!isChecked && isExhausted)
                          }
                          isChecked={isChecked!}
                          onChange={() => onChange(isChecked, code)}
                        >
                          {language}
                        </Checkbox>
                      )
                    })}
                  </SimpleGrid>
                ) : (
                  <Center p="40px 20px 30px">
                    <Spinner />
                  </Center>
                )}
              </Box>

              <Button
                mt="32px"
                variant="solid-rounded"
                colorScheme="primaryButton"
                type="submit"
                isLoading={isUpdating}
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
