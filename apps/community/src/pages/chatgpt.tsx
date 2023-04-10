import {
  Box,
  BoxProps,
  Checkbox,
  Circle,
  Flex,
  Grid,
  Heading,
  Icon,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
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
import { ReactComponent as UnlockSvg } from '../assets/ChatGPT/unlock.svg'
import { ReactComponent as LockSvg } from '../assets/ChatGPT/lock.svg'

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

  const currentCount = 100
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

  const curProgressData = lockProgressConfig.reduce(
    (acc, cur) => {
      if (cur.subscribers <= currentCount) {
        return cur
      }
      return acc
    },
    {
      subscribers: 0,
      unlockNum: 0,
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
                  {`${t('translation.subscribers')}: ${currentCount}`}
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
                    const isActive = currentCount >= subscribers
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
