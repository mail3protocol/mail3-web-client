/* eslint-disable no-nested-ternary */
import {
  Center,
  Flex,
  FormControl,
  HStack,
  Spinner,
  Text,
  Button as RawButton,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useCheckbox,
  UnorderedList,
  ListItem,
  Portal,
  Icon as RawIcon,
  Tooltip,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { ChevronRightIcon, QuestionOutlineIcon } from '@chakra-ui/icons'
import { useUpdateAtom } from 'jotai/utils'
import { useTranslation, Trans } from 'react-i18next'
import React, { useCallback, useMemo, useState } from 'react'
import { Button } from 'ui'
import {
  useAccount,
  useDialog,
  useToast,
  useTrackClick,
  TrackEvent,
} from 'hooks'
import { useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  truncateMiddle,
  isPrimitiveEthAddress,
  isEnsDomain,
  isBitDomain,
  isZilpayAddress,
  truncateMailAddress,
  copyText,
  isUdDomain,
} from 'shared'
import { useAtom } from 'jotai'
import { Alias, AliasMailType } from 'models'
import { useAPI } from '../../hooks/useAPI'
import { Query } from '../../api/query'
import happySetupMascot from '../../assets/happy-setup-mascot.png'
import unhappySetupMascot from '../../assets/unhappy-setup-mascot.png'

import { ReactComponent as DefaultSvg } from '../../assets/settings/0x.svg'
import { ReactComponent as UdSvg } from '../../assets/settings/ud.svg'
import { ReactComponent as BitSvg } from '../../assets/settings/bit.svg'
import { ReactComponent as SubBitSvg } from '../../assets/settings/premium.svg'
import { ReactComponent as EnsSvg } from '../../assets/settings/ens.svg'
import { ReactComponent as MoreSvg } from '../../assets/settings/more.svg'
import { ReactComponent as CircleCurSvg } from '../../assets/settings/tick-circle-cur.svg'
import { ReactComponent as CircleSvg } from '../../assets/settings/tick-circle.svg'
import { ReactComponent as SwitchSvg } from '../../assets/settings/switch.svg'
import { ReactComponent as ArrawDowmSvg } from '../../assets/settings/arrow-down.svg'
import { RoutePath } from '../../route/path'
import { Mascot } from './Mascot'
import {
  BIT_DOMAIN,
  ENS_DOMAIN,
  MAIL_SERVER_URL,
  UD_DOMAIN,
  BNB_DOMAIN,
} from '../../constants'
import { userPropertiesAtom } from '../../hooks/useLogin'
import { RouterLink } from '../RouterLink'
import { SubBitAlias, SwitchPanel } from './SwitchPanel'

export enum AliasType {
  ENS = 'ENS',
  BIT = 'BIT',
  SUB_BIT = 'SUB_BIT',
  UD = 'UD',
  BNB = 'BNB',
}

enum TabItemType {
  Ens = 0,
  Bit = 1,
  SubBit = 2,
  More = 3,
}

enum MoreItemType {
  Default = 1,
  Ud = 2,
  Bnb = 3,
}

const tabsConfig: Record<
  TabItemType,
  {
    Icon: any
    name: string
  }
> = {
  [TabItemType.Ens]: {
    Icon: EnsSvg,
    name: 'ENS Name',
  },
  [TabItemType.Bit]: {
    Icon: BitSvg,
    name: '.bit Name',
  },
  [TabItemType.SubBit]: {
    Icon: SubBitSvg,
    name: 'Premium Name',
  },
  [TabItemType.More]: {
    Icon: MoreSvg,
    name: 'More',
  },
}

const Container = styled(Center)`
  flex-direction: column;
  width: 100%;

  .address-big {
    background: rgba(78, 82, 245, 0.1);
    border-radius: 39px;
    font-weight: 500;
    font-size: 18px;
    line-height: 44px;
    height: 44px;
    color: #000;
  }

  .tablist::-webkit-scrollbar {
    display: none;
  }

  .mascot {
    bottom: 0;
    // 240 = content width / 2
    // 164 = mascot width
    // 20 = gutter
    right: calc(50% - 240px - 164px - 20px);
    z-index: 1;
    position: absolute;

    @media (max-width: 930px) {
      position: static;
      bottom: 50px;
    }
  }

  .footer {
    display: none;
    @media (max-width: 930px) {
      display: flex;
      margin-top: 10px;
    }
  }

  .switch-wrap {
    background: rgba(243, 243, 243, 0.5);
    border: 1px solid #e7e7e7;
    border-radius: 16px;
    overflow: hidden;
  }
`

export interface EmailSwitchProps {
  emailAddress: string
  account: string
  isLoading?: boolean
  uuid: string
  isChecked: boolean
  address: string
  // eslint-disable-next-line prettier/prettier
  onChange: (uuid: string, address: string) => (e: React.ChangeEvent<HTMLInputElement>) => void
  isAllowShort?: boolean
  onSwitch?: () => void
  isFullName?: boolean
}

const NewCheckbox = (props: any) => {
  const { onChange } = props
  const { state, getCheckboxProps, getInputProps, htmlProps } =
    useCheckbox(props)

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gridColumnGap={2}
      w="24px"
      h="24px"
      rounded="lg"
      cursor="pointer"
      {...htmlProps}
      onClick={onChange}
    >
      <input {...getInputProps()} hidden />
      <Flex
        alignItems="center"
        justifyContent="center"
        w={8}
        h={8}
        {...getCheckboxProps()}
      >
        {state.isChecked ? <CircleCurSvg /> : <CircleSvg />}
      </Flex>
    </Box>
  )
}

export const EmailSwitch: React.FC<EmailSwitchProps> = ({
  emailAddress,
  onChange,
  isLoading = false,
  isChecked,
  address,
  uuid,
  isAllowShort,
  onSwitch,
  isFullName,
}) => {
  const [t] = useTranslation('settings')

  return (
    <Flex
      justifyContent="space-between"
      borderRadius="8px"
      border={isChecked ? '1px solid #4E52F5' : '1px solid #e7e7e7'}
      padding="10px 16px 10px 16px"
      w="100%"
      bg="#fff"
    >
      <Text fontSize="14px">{emailAddress}</Text>
      {isLoading ? (
        <Spinner />
      ) : (
        <Center>
          {isChecked && isAllowShort ? (
            <Tooltip
              label={t(`settings.${isFullName ? 'short' : 'full'}`)}
              hasArrow
              bg="white"
              placement="top"
            >
              <Center as="button" mr="10px" onClick={onSwitch}>
                <RawIcon w="20px" h="20px" as={SwitchSvg} />
              </Center>
            </Tooltip>
          ) : null}
          <NewCheckbox
            colorScheme="deepBlue"
            isReadOnly={isChecked}
            isChecked={isChecked}
            onChange={onChange(uuid, address)}
          />
        </Center>
      )}
    </Flex>
  )
}

export const generateEmailAddress = (s = '') => {
  const [address, rest] = s.split('@')
  if (isPrimitiveEthAddress(address) || isZilpayAddress(address))
    return `${truncateMiddle(address, 6, 4)}@${
      rest || MAIL_SERVER_URL
    }`.toLowerCase()

  return s
}

export const SettingAddress: React.FC = () => {
  const [t] = useTranslation('settings')
  const [t2] = useTranslation('common')
  const router = useLocation()
  const account = useAccount()
  const api = useAPI()
  const toast = useToast()
  const dialog = useDialog()
  const trackClickENSRefresh = useTrackClick(TrackEvent.ClickENSRefresh)
  const trackClickBITRefresh = useTrackClick(TrackEvent.ClickBITRefresh)
  const [userProps, setUserProperties] = useAtom(userPropertiesAtom)
  const trackClickRegisterENS = useTrackClick(TrackEvent.ClickRegisterENS)
  const trackClickRegisterBIT = useTrackClick(TrackEvent.ClickRegisterBIT)
  const trackClickRegisterUD = useTrackClick(TrackEvent.ClickRegisterUD)
  const trackClickRegisterBNB = useTrackClick(TrackEvent.ClickRegisterBNB)
  const trackNext = useTrackClick(TrackEvent.ClickAddressNext)

  const [activeAccount, setActiveAccount] = useState(account)
  const [activeMoreItem, setActiveMoreItem] = useState(MoreItemType.Default)

  const {
    data: aliasDate,
    isLoading,
    refetch,
  } = useQuery(
    [Query.Alias, account],
    async () => (await api.getAliases()).data,
    {
      enabled: !!account,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      async onSuccess(d) {
        const defaultAlias: Alias =
          d.aliases.find((alias) => alias.is_default) || d.aliases[0]
        setActiveAccount(defaultAlias.uuid)
        const userInfo = await api.getUserInfo()
        const { aliases } = d
        const defaultAddress = defaultAlias.address
        const userRole = userInfo.data.user_role
        const ownUDAddress = d.aliases.some(
          (a) => a.email_type === AliasMailType.UD
        )
        setUserProperties((config) => {
          const newConfig = {
            ...config,
            aliases,
            defaultAddress,
            user_role: userRole,
            own_ud_address: ownUDAddress,
          }
          try {
            gtag?.('set', 'user_properties', newConfig)
          } catch (error) {
            //
          }
          return newConfig
        })
      },
    }
  )

  const onRefreshDomains = async (type: AliasType) => {
    try {
      if (type === AliasType.ENS) {
        trackClickENSRefresh()
        await api.updateAliasEnsList()
      }
      if (type === AliasType.BIT || type === AliasType.SUB_BIT) {
        trackClickBITRefresh()
        await api.updateAliasBitList()
      }
      if (type === AliasType.UD) {
        await api.updateAliasUDList()
      }
      if (type === AliasType.BNB) {
        await api.updateAliasBnbList()
      }
      await refetch()
    } catch (e: any) {
      if (e?.response?.data?.message?.includes('deadline')) {
        toast(t('address.refresh_failed') + e.toString())
      } else if (e.response.data.reason !== 'EMPTY_ENS_LIST') {
        toast(t('address.refresh_failed') + e.toString())
      }
    }
  }

  const setUserInfo = useUpdateAtom(userPropertiesAtom)

  const onDefaultAccountChange =
    (isPrimitive = false) =>
    (uuid: string, address: string) =>
    async () => {
      const prevActiveAccount = activeAccount
      try {
        setActiveAccount(uuid)
        await api.setDefaultSentAddress(uuid)
        if (isPrimitive) {
          setUserInfo((prev) => ({
            ...prev,
            defaultAddress: address,
          }))
        } else {
          setUserInfo((prev) => ({
            ...prev,
            defaultAddress: address,
            user_role: 1,
          }))
        }
      } catch (error) {
        setActiveAccount(prevActiveAccount)
        dialog({
          type: 'warning',
          description: t('address.request-failed'),
        })
      }
    }

  const aliases = useMemo(
    () =>
      (aliasDate?.aliases || []).reduce<{
        primitive: Alias | null
        ens: Alias[]
        bit: Alias[]
        subBit: Alias[]
        ud: Alias[]
        bnb: Alias[]
      }>(
        (o, item) => {
          const [addr] = item.address.split('@')
          if (item.email_type === AliasMailType.Bnb)
            return { ...o, bnb: [...o.bnb, item] }
          if (item.email_type === AliasMailType.SubBit)
            return { ...o, subBit: [...o.subBit, item] }
          if (isBitDomain(addr)) return { ...o, bit: [...o.bit, item] }
          if (isEnsDomain(addr)) return { ...o, ens: [...o.ens, item] }
          if (isPrimitiveEthAddress(addr) || isZilpayAddress(addr))
            return { ...o, primitive: item }
          if (isUdDomain(addr)) {
            return { ...o, ud: [...o.ud, item] }
          }
          return o
        },
        {
          primitive: null,
          ens: [],
          bit: [],
          subBit: [],
          ud: [],
          bnb: [],
        }
      ),
    [aliasDate]
  )

  const subBitList = useMemo(() => {
    const grouped = aliases.subBit.reduce(
      (acc: Record<string, { full: Alias; short: Alias }>, curr: Alias) => {
        const key = curr.address.split('@')[0]
        const unitKey = key.replace(/\.bit$/, '')
        const group = acc[unitKey] || { full: null, short: null }
        if (curr.address.includes('.bit@')) {
          group.full = curr
        } else {
          group.short = curr
        }
        acc[unitKey] = group
        return acc
      },
      {}
    )

    const result = Object.values(grouped)
      .map((group: SubBitAlias) =>
        group.short ? [group.short, group.full] : [group.full]
      )
      .flat()
      .filter((item) => !!item)

    return result
  }, [aliases.subBit])

  const onCopy = async () => {
    await copyText(userProps?.defaultAddress)
    toast(t('address.copied'), {
      status: 'success',
    })
  }

  const NotFound: React.FC<{ p4Key?: string }> = useCallback(
    ({ p4Key = 'address.not-found-p4' }) => (
      <Box
        fontSize={{ base: '12px', md: '14px' }}
        p="8px 16px"
        textAlign="center"
      >
        <Box
          fontSize={{ base: '14px', md: '16px' }}
          fontWeight="600"
          lineHeight="1"
        >
          <Trans ns="settings" i18nKey="address.not-found-p1" t={t} />
        </Box>
        <Box lineHeight="2">
          <Box>{t('address.not-found-p2')}</Box>
          <UnorderedList textAlign="left" pl={{ base: '30px', md: '70px' }}>
            <ListItem>{t('address.not-found-p3')}</ListItem>
            <ListItem>{t(p4Key)}</ListItem>
          </UnorderedList>
        </Box>
      </Box>
    ),
    []
  )

  const tabItemTypes = [
    TabItemType.Ens,
    TabItemType.Bit,
    TabItemType.SubBit,
    TabItemType.More,
  ]

  const defaultTabIndex = useMemo(() => {
    if (!userProps?.aliases) return 0
    const defaultAlias = (userProps.aliases as Alias[]).find(
      (alias) => alias.is_default
    )
    const indexMap: { [key in AliasMailType]?: number } = {
      [AliasMailType.Ens]: 0,
      [AliasMailType.Bit]: 1,
      [AliasMailType.SubBit]: 2,
      [AliasMailType.UD]: 3,
    }
    const currentIndex = indexMap[defaultAlias?.email_type as AliasMailType]
    return currentIndex === undefined ? 3 : currentIndex
  }, [userProps])

  const [tabIndex, setTabIndex] = React.useState(defaultTabIndex)
  const handleTabsChange = (index: number) => {
    if (index !== 3) {
      setTabIndex(index)
    }
  }

  const MoreItemTypes = [
    {
      type: MoreItemType.Bnb,
      onClick: () => {
        setTabIndex(3)
        setActiveMoreItem(MoreItemType.Bnb)
      },
      label: t2('connect.bnb'),
      Icon: UdSvg,
    },
    {
      type: MoreItemType.Ud,
      onClick: () => {
        setTabIndex(3)
        setActiveMoreItem(MoreItemType.Ud)
      },
      label: t2('connect.ud'),
      Icon: UdSvg,
    },
    {
      type: MoreItemType.Default,
      onClick: () => {
        setActiveMoreItem(MoreItemType.Default)
        setTabIndex(3)
      },
      label: t2('connect.wallet-address'),
      Icon: DefaultSvg,
    },
  ]

  return (
    <Container pb={{ md: '100px', base: 0 }}>
      <Center
        className="address-big"
        w={{ md: '470px', base: '100%' }}
        cursor="pointer"
        onClick={onCopy}
      >
        {truncateMailAddress(userProps?.defaultAddress)}
      </Center>
      <Center>
        <Center
          cursor="pointer"
          display={{ base: 'flex', md: 'none' }}
          onClick={() => {
            dialog({
              type: 'text',
              showClose: true,
              title: (
                <Box
                  fontWeight="700"
                  fontSize="14px"
                  lineHeight="18px"
                  textAlign="left"
                >
                  {t('address.hover-title')}
                </Box>
              ),
              description: (
                <UnorderedList
                  background="#F3F3F3"
                  borderRadius="16px"
                  fontWeight="400"
                  fontSize="12px"
                  lineHeight="18px"
                  textAlign="left"
                  p="20px"
                  m="0"
                >
                  <ListItem>{t('address.hover-content')}</ListItem>
                </UnorderedList>
              ),
            })
          }}
        >
          <Text fontWeight={400} fontSize="12px" color="#4E52F5">
            {t('address.outgoing')}
          </Text>
          <QuestionOutlineIcon h="40px" color="#4E52F5" ml="5px" />
        </Center>

        <Popover trigger="hover">
          <PopoverTrigger>
            <Center cursor="pointer" display={{ base: 'none', md: 'flex' }}>
              <Text fontWeight={400} fontSize="12px" color="#4E52F5">
                {t('address.outgoing')}
              </Text>
              <QuestionOutlineIcon h="40px" color="#4E52F5" ml="5px" />
            </Center>
          </PopoverTrigger>
          <PopoverContent p="10px" borderRadius="24px" textAlign="center">
            <PopoverArrow />
            <PopoverHeader
              border="none"
              fontWeight="700"
              fontSize="14px"
              lineHeight="18px"
            >
              {t('address.hover-title')}
            </PopoverHeader>
            <PopoverBody>
              <UnorderedList
                background="#F3F3F3"
                borderRadius="16px"
                fontWeight="400"
                fontSize="12px"
                lineHeight="18px"
                textAlign="left"
                p="20px"
                m="0"
              >
                <ListItem>{t('address.hover-content')}</ListItem>
              </UnorderedList>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Center>

      <Box w={{ base: '100%', md: 'auto' }} mt="15px">
        <Tabs
          position="relative"
          defaultIndex={defaultTabIndex}
          index={tabIndex}
          onChange={handleTabsChange}
        >
          <TabList
            className="tablist"
            w={{ base: '100%', md: 'auto' }}
            overflowX="scroll"
            overflowY="hidden"
            justifyContent={{ base: 'flex-start', md: 'space-around' }}
            border="none"
            position="relative"
          >
            <Box
              w="100%"
              bottom="0"
              position="absolute"
              zIndex="1"
              bg="#F3F3F3"
              h="1px"
            />
            <HStack
              spacing={{ base: 0, md: '50px' }}
              position="relative"
              zIndex="2"
            >
              {tabItemTypes.map((type) => {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const { Icon, name } = tabsConfig[type]
                return (
                  <Tab
                    key={type}
                    _selected={{
                      fontWeight: 600,
                      _before: {
                        content: '""',
                        position: 'absolute',
                        w: '50px',
                        h: '4px',
                        bottom: '-1px',
                        bg: '#000',
                        ml: '20px',
                        borderRadius: '4px',
                      },
                    }}
                    position="relative"
                    p={{ base: '5px', md: 'auto' }}
                  >
                    {name === 'More' ? (
                      <Popover>
                        <PopoverTrigger>
                          <HStack>
                            <Icon />
                            <Box
                              whiteSpace="nowrap"
                              fontSize={{ base: '14px', md: '18px' }}
                              marginInlineStart={{
                                base: '2px !important',
                                md: '6px !important',
                              }}
                            >
                              {name}
                            </Box>
                            <RawIcon
                              as={ArrawDowmSvg}
                              width="20px"
                              height="20px"
                            />
                          </HStack>
                        </PopoverTrigger>
                        <Portal>
                          <PopoverContent w="230px">
                            <PopoverArrow />
                            <PopoverBody>
                              {MoreItemTypes.map((item, index) => {
                                const { Icon: IconSrc, onClick, label } = item
                                return (
                                  <RawButton
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    fontWeight={500}
                                    leftIcon={
                                      <RawIcon w="20px" h="20px" as={IconSrc} />
                                    }
                                    onClick={onClick}
                                  >
                                    {label}
                                  </RawButton>
                                )
                              })}
                            </PopoverBody>
                          </PopoverContent>
                        </Portal>
                      </Popover>
                    ) : (
                      <HStack>
                        <Icon />
                        <Box
                          whiteSpace="nowrap"
                          fontSize={{ base: '14px', md: '18px' }}
                          marginInlineStart={{
                            base: '2px !important',
                            md: '6px !important',
                          }}
                        >
                          {name}
                        </Box>
                      </HStack>
                    )}
                  </Tab>
                )
              })}
            </HStack>
          </TabList>

          <Center p="32px 10px">
            <Box w="600px" textAlign="center" fontSize="12px">
              <Trans
                ns="settings"
                i18nKey="address.text"
                t={t}
                components={{
                  a: <span style={{ color: '#4E52F5' }} />,
                }}
              />
            </Box>
          </Center>

          <FormControl>
            <Flex justifyContent="center" pt="8px" minH="200px">
              <TabPanels maxW="480px">
                {tabItemTypes.map((type) => {
                  let Content = <Box />

                  // eslint-disable-next-line default-case
                  switch (type) {
                    case TabItemType.SubBit:
                      Content = (
                        <SwitchPanel
                          isLoading={isLoading}
                          list={subBitList}
                          emptyNode={
                            <NotFound p4Key="address.not-found-p4-premium" />
                          }
                          activeAccount={activeAccount}
                          onRefresh={async () =>
                            onRefreshDomains(AliasType.SUB_BIT)
                          }
                          onChange={onDefaultAccountChange(false)}
                        />
                      )
                      break
                    case TabItemType.Ens:
                      Content = (
                        <SwitchPanel
                          isLoading={isLoading}
                          list={aliases.ens}
                          emptyNode={<NotFound />}
                          activeAccount={activeAccount}
                          onRefresh={async () =>
                            onRefreshDomains(AliasType.ENS)
                          }
                          onChange={onDefaultAccountChange(false)}
                          register={{
                            i18nKey: 'address.register-ens',
                            onClick: () => trackClickRegisterENS(),
                            href: ENS_DOMAIN,
                          }}
                        />
                      )
                      break
                    case TabItemType.Bit:
                      Content = (
                        <SwitchPanel
                          isLoading={isLoading}
                          list={aliases.bit}
                          emptyNode={<NotFound />}
                          activeAccount={activeAccount}
                          onRefresh={async () =>
                            onRefreshDomains(AliasType.BIT)
                          }
                          onChange={onDefaultAccountChange(false)}
                          register={{
                            i18nKey: 'address.register-bit',
                            onClick: () => trackClickRegisterBIT(),
                            href: BIT_DOMAIN,
                          }}
                        />
                      )
                      break
                    case TabItemType.More:
                      if (activeMoreItem === MoreItemType.Ud) {
                        Content = (
                          <SwitchPanel
                            isLoading={isLoading}
                            list={aliases.ud}
                            emptyNode={<NotFound />}
                            activeAccount={activeAccount}
                            onRefresh={async () =>
                              onRefreshDomains(AliasType.UD)
                            }
                            onChange={onDefaultAccountChange(false)}
                            register={{
                              i18nKey: 'address.register-ud',
                              onClick: () => trackClickRegisterUD(),
                              href: UD_DOMAIN,
                            }}
                          />
                        )
                      } else if (activeMoreItem === MoreItemType.Bnb) {
                        Content = (
                          <SwitchPanel
                            isLoading={isLoading}
                            list={aliases.bnb}
                            emptyNode={<NotFound />}
                            activeAccount={activeAccount}
                            onRefresh={async () =>
                              onRefreshDomains(AliasType.BNB)
                            }
                            onChange={onDefaultAccountChange(false)}
                            register={{
                              i18nKey: 'address.register-bnb',
                              onClick: () => trackClickRegisterBNB(),
                              href: BNB_DOMAIN,
                            }}
                          />
                        )
                      }
                      if (
                        aliases.primitive &&
                        activeMoreItem === MoreItemType.Default
                      ) {
                        Content = (
                          <Box className="switch-wrap">
                            <Box p="16px 8px">
                              <EmailSwitch
                                uuid={aliases.primitive.uuid ?? 'first_alias'}
                                emailAddress={generateEmailAddress(
                                  aliases.primitive.address ?? account
                                )}
                                account={aliases.primitive.address}
                                onChange={onDefaultAccountChange(true)}
                                key={aliases.primitive.address}
                                address={aliases.primitive.address ?? account}
                                isLoading={isLoading}
                                isChecked={
                                  aliases.primitive.uuid === activeAccount ||
                                  aliasDate?.aliases?.length === 1
                                }
                              />
                            </Box>
                          </Box>
                        )
                        break
                      }
                  }

                  return <TabPanel key={type}>{Content}</TabPanel>
                })}
              </TabPanels>
            </Flex>
          </FormControl>
        </Tabs>
      </Box>

      {isLoading ? null : (
        <Flex className="mascot">
          <Mascot
            src={
              userProps?.defaultAddress.startsWith('0x')
                ? unhappySetupMascot
                : happySetupMascot
            }
          />
        </Flex>
      )}

      {(router.pathname as any) !== RoutePath.Settings ? (
        <Center className="footer" w="full">
          <RouterLink href={RoutePath.SetupAvatar} passHref>
            <Button
              bg="black"
              color="white"
              w="250px"
              height="50px"
              onClick={() => trackNext()}
              _hover={{
                bg: 'brand.50',
              }}
              as="a"
              rightIcon={<ChevronRightIcon color="white" />}
            >
              <Center flexDirection="column">
                <Text>{t('setup.next')}</Text>
              </Center>
            </Button>
          </RouterLink>
        </Center>
      ) : null}
    </Container>
  )
}
