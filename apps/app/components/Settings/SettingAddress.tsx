/* eslint-disable no-nested-ternary */
import {
  Center,
  Flex,
  FormControl,
  HStack,
  Link,
  Spinner,
  Stack,
  Text,
  VStack,
  Icon,
  Button as RowButton,
  Box,
  Spacer,
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
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { ChevronRightIcon, QuestionOutlineIcon } from '@chakra-ui/icons'
import { useUpdateAtom } from 'jotai/utils'
import { useTranslation, Trans } from 'react-i18next'
import React, { useMemo, useState } from 'react'
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
} from 'shared'
import { useAtom } from 'jotai'
import { useAPI } from '../../hooks/useAPI'
import { Query } from '../../api/query'
import happySetupMascot from '../../assets/happy-setup-mascot.png'
import unhappySetupMascot from '../../assets/unhappy-setup-mascot.png'
import { ReactComponent as RefreshSvg } from '../../assets/refresh.svg'
import { ReactComponent as ArrawSvg } from '../../assets/setup/arrow.svg'
import { ReactComponent as DefaultSvg } from '../../assets/settings/0x.svg'
import { ReactComponent as BitSvg } from '../../assets/settings/bit.svg'
import { ReactComponent as EnsSvg } from '../../assets/settings/ens.svg'
import { ReactComponent as MoreSvg } from '../../assets/settings/more.svg'
import { ReactComponent as CircleCurSvg } from '../../assets/settings/tick-circle-cur.svg'
import { ReactComponent as CircleSvg } from '../../assets/settings/tick-circle.svg'
import { RoutePath } from '../../route/path'
import { Mascot } from './Mascot'
import { MAIL_SERVER_URL } from '../../constants'
import { userPropertiesAtom } from '../../hooks/useLogin'
import { Alias } from '../../api'
import { RouterLink } from '../RouterLink'

enum TabItemType {
  Default = 0,
  Ens = 1,
  Bit = 2,
  More = 3,
}

const tabsConfig: Record<
  TabItemType,
  {
    Icon: any
    name: string
  }
> = {
  [TabItemType.Default]: {
    Icon: DefaultSvg,
    name: 'Wallet Address',
  },
  [TabItemType.Ens]: {
    Icon: EnsSvg,
    name: 'ENS Name',
  },
  [TabItemType.Bit]: {
    Icon: BitSvg,
    name: '.bit Name',
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

interface EmailSwitchProps {
  emailAddress: string
  account: string
  isLoading?: boolean
  uuid: string
  isChecked: boolean
  address: string
  // eslint-disable-next-line prettier/prettier
  onChange: (uuid: string, address: string) => (e: React.ChangeEvent<HTMLInputElement>) => void
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

const EmailSwitch: React.FC<EmailSwitchProps> = ({
  emailAddress,
  onChange,
  isLoading = false,
  isChecked,
  address,
  uuid,
}) => (
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
      <NewCheckbox
        colorScheme="deepBlue"
        isReadOnly={isChecked}
        isChecked={isChecked}
        onChange={onChange(uuid, address)}
      />
    )}
  </Flex>
)

const generateEmailAddress = (s = '') => {
  const [address, rest] = s.split('@')
  if (isPrimitiveEthAddress(address) || isZilpayAddress(address))
    return `${truncateMiddle(address, 6, 4)}@${
      rest || MAIL_SERVER_URL
    }`.toLowerCase()

  return s
}

const ENS_DOMAIN = 'https://app.ens.domains'
const BIT_DOMAIN =
  'https://www.did.id/?inviter=mail3dao.bit&channel=mail3dao.bit'

enum AliasType {
  ENS = 'ENS',
  BIT = 'BIT',
}

const LIMIT_MAX_NUMBER = 5

export const SettingAddress: React.FC = () => {
  const [t] = useTranslation('settings')
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
  const trackNext = useTrackClick(TrackEvent.ClickAddressNext)

  const [activeAccount, setActiveAccount] = useState(account)
  const [isRefreshingMap, setIsRefeshingMap] = useState({
    [AliasType.BIT]: false,
    [AliasType.ENS]: false,
  })
  const [isOpenMoreMap, setIsOpenMoreMap] = useState({
    [AliasType.BIT]: false,
    [AliasType.ENS]: false,
  })

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
      onSuccess(d) {
        const defaultAlias: Alias =
          d.aliases.find((alias) => alias.is_default) || d.aliases[0]
        setActiveAccount(defaultAlias.uuid)
        setUserProperties((config) => ({
          ...config,
          aliases: d.aliases,
          defaultAddress: defaultAlias.address,
        }))
      },
    }
  )

  const onRefreshDomains = async (type: AliasType) => {
    setIsRefeshingMap((s) => ({
      ...s,
      [type]: true,
    }))
    try {
      if (type === AliasType.ENS) {
        trackClickENSRefresh()
        await api.updateAliasEnsList()
      }
      if (type === AliasType.BIT) {
        trackClickBITRefresh()
        await api.updateAliasBitList()
      }
      await refetch()
    } catch (e: any) {
      if (e.response.data.reason !== 'EMPTY_ENS_LIST') {
        toast(t('address.refresh_failed') + e.toString())
      }
    } finally {
      setIsRefeshingMap((s) => ({
        ...s,
        [type]: false,
      }))
    }
  }

  const setUserInfo = useUpdateAtom(userPropertiesAtom)
  const onDefaultAccountChange =
    (uuid: string, address: string) => async () => {
      const prevActiveAccount = activeAccount
      try {
        setActiveAccount(uuid)
        await api.setDefaultSentAddress(uuid)
        setUserInfo((prev) => ({
          ...prev,
          defaultAddress: address,
        }))
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
      }>(
        (o, item) => {
          const [addr] = item.address.split('@')
          if (isBitDomain(addr)) return { ...o, bit: [...o.bit, item] }
          if (isEnsDomain(addr)) return { ...o, ens: [...o.ens, item] }
          if (isPrimitiveEthAddress(addr) || isZilpayAddress(addr))
            return { ...o, primitive: item }
          return o
        },
        {
          primitive: null,
          ens: [],
          bit: [],
        }
      ),
    [aliasDate]
  )

  const { primitive: primitiveAlias } = aliases

  const ensAliases = isOpenMoreMap[AliasType.ENS]
    ? aliases.ens
    : aliases.ens.slice(0, LIMIT_MAX_NUMBER)
  const bitAliases = isOpenMoreMap[AliasType.BIT]
    ? aliases.bit
    : aliases.bit.slice(0, LIMIT_MAX_NUMBER)

  const getRefreshButton = (type: AliasType) => (
    <RowButton
      variant="link"
      colorScheme="deepBlue"
      leftIcon={<Icon as={RefreshSvg} w="14px" h="14px" />}
      onClick={() => onRefreshDomains(type)}
      isLoading={isRefreshingMap[type]}
      fontWeight="400"
      fontSize="16px"
    >
      {t('address.refresh')}
    </RowButton>
  )

  const onCopy = async () => {
    await copyText(userProps?.defaultAddress)
    toast(t('address.copied'), {
      status: 'success',
    })
  }

  const NotFound = (
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
          <ListItem>{t('address.not-found-p4')}</ListItem>
        </UnorderedList>
      </Box>
    </Box>
  )

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
        <Tabs position="relative">
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
              {[
                TabItemType.Default,
                TabItemType.Ens,
                TabItemType.Bit,
                // TabItemType.More,
              ].map((type) => {
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
                {[
                  TabItemType.Default,
                  TabItemType.Ens,
                  TabItemType.Bit,
                  // TabItemType.More,
                ].map((type) => {
                  if (type === TabItemType.Default) {
                    return (
                      <TabPanel key={type}>
                        {primitiveAlias ? (
                          <Box className="switch-wrap">
                            <Box p="16px 8px 16px 8px">
                              <EmailSwitch
                                uuid={primitiveAlias.uuid ?? 'first_alias'}
                                emailAddress={generateEmailAddress(
                                  primitiveAlias.address ?? account
                                )}
                                account={primitiveAlias.address}
                                onChange={onDefaultAccountChange}
                                key={primitiveAlias.address}
                                address={primitiveAlias.address ?? account}
                                isLoading={isLoading}
                                isChecked={
                                  primitiveAlias.uuid === activeAccount ||
                                  aliasDate?.aliases?.length === 1
                                }
                              />
                            </Box>
                          </Box>
                        ) : null}
                      </TabPanel>
                    )
                  }

                  if (type === TabItemType.Ens) {
                    return (
                      <TabPanel>
                        {!isLoading ? (
                          <Box className="switch-wrap">
                            <Box p="16px 8px 16px 8px">
                              {!ensAliases.length ? NotFound : null}

                              <VStack spacing="10px">
                                {ensAliases.map((a) => (
                                  <EmailSwitch
                                    uuid={a.uuid}
                                    address={a.address}
                                    emailAddress={generateEmailAddress(
                                      a.address
                                    )}
                                    account={a.address}
                                    onChange={onDefaultAccountChange}
                                    key={a.address}
                                    isChecked={a.uuid === activeAccount}
                                  />
                                ))}
                              </VStack>
                              {aliases.ens.length > LIMIT_MAX_NUMBER &&
                              !isOpenMoreMap[AliasType.ENS] ? (
                                <Center
                                  cursor="pointer"
                                  pt="8px"
                                  fontSize="12px"
                                  lineHeight="18px"
                                  onClick={() => {
                                    setIsOpenMoreMap({
                                      ...isOpenMoreMap,
                                      [AliasType.ENS]: true,
                                    })
                                  }}
                                >
                                  <ArrawSvg />
                                  <Box ml="2px">{` +${
                                    aliases.ens.length - LIMIT_MAX_NUMBER
                                  }`}</Box>
                                </Center>
                              ) : null}
                            </Box>
                            <Flex h="44px" bg="#fff" p="0 18px">
                              {getRefreshButton(AliasType.ENS)}
                              <Spacer />
                              <Center alignItems="center">
                                <Text fontSize="14px" fontWeight={500}>
                                  <Stack
                                    direction="row"
                                    spacing="16px"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                  >
                                    <Box>
                                      <Trans
                                        ns="settings"
                                        i18nKey="address.register-ens"
                                        t={t}
                                        components={{
                                          a: (
                                            <Link
                                              isExternal
                                              onClick={() =>
                                                trackClickRegisterENS()
                                              }
                                              href={ENS_DOMAIN}
                                              color="#4E52F5"
                                            />
                                          ),
                                        }}
                                      />
                                    </Box>
                                  </Stack>
                                </Text>
                              </Center>
                            </Flex>
                          </Box>
                        ) : null}
                      </TabPanel>
                    )
                  }

                  if (type === TabItemType.Bit) {
                    return (
                      <TabPanel>
                        {!isLoading ? (
                          <Box className="switch-wrap">
                            <Box p="16px 8px 16px 8px">
                              {!bitAliases.length ? NotFound : null}
                              <VStack spacing="10px">
                                {bitAliases.map((a) => (
                                  <EmailSwitch
                                    uuid={a.uuid}
                                    address={a.address}
                                    emailAddress={generateEmailAddress(
                                      a.address
                                    )}
                                    account={a.address}
                                    onChange={onDefaultAccountChange}
                                    key={a.address}
                                    isChecked={a.uuid === activeAccount}
                                  />
                                ))}
                              </VStack>
                              {aliases.bit.length > LIMIT_MAX_NUMBER &&
                              !isOpenMoreMap[AliasType.BIT] ? (
                                <Center
                                  cursor="pointer"
                                  pt="8px"
                                  fontSize="12px"
                                  lineHeight="18px"
                                  onClick={() => {
                                    setIsOpenMoreMap({
                                      ...isOpenMoreMap,
                                      [AliasType.BIT]: true,
                                    })
                                  }}
                                >
                                  <ArrawSvg />
                                  <Box ml="2px">{` +${
                                    aliases.bit.length - LIMIT_MAX_NUMBER
                                  }`}</Box>
                                </Center>
                              ) : null}
                            </Box>

                            <Flex h="44px" bg="#fff" p="0 18px">
                              {getRefreshButton(AliasType.BIT)}
                              <Spacer />
                              <Center alignItems="center">
                                <Text fontSize="14px" fontWeight={500}>
                                  <Stack
                                    direction="row"
                                    spacing="16px"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                  >
                                    <Box>
                                      <Trans
                                        ns="settings"
                                        i18nKey="address.register-bit"
                                        t={t}
                                        components={{
                                          a: (
                                            <Link
                                              isExternal
                                              onClick={() =>
                                                trackClickRegisterBIT()
                                              }
                                              href={BIT_DOMAIN}
                                              color="#4E52F5"
                                            />
                                          ),
                                        }}
                                      />
                                    </Box>
                                  </Stack>
                                </Text>
                              </Center>
                            </Flex>
                          </Box>
                        ) : null}
                      </TabPanel>
                    )
                  }

                  return <TabPanel key={type} />
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
          <RouterLink href={RoutePath.SetupSignature} passHref>
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
