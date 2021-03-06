/* eslint-disable no-nested-ternary */
import {
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Link,
  Spinner,
  Stack,
  Switch,
  Text,
  Tooltip,
  VStack,
  Icon,
  Button as RowButton,
  Box,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import {
  ChevronRightIcon,
  CheckCircleIcon,
  QuestionOutlineIcon,
} from '@chakra-ui/icons'
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
import { truncateMiddle, isPrimitiveEthAddress } from 'shared'
import { useAPI } from '../../hooks/useAPI'
import { Query } from '../../api/query'
import happySetupMascot from '../../assets/happy-setup-mascot.png'
import { ReactComponent as RefreshSvg } from '../../assets/refresh.svg'
import { RoutePath } from '../../route/path'
import { Mascot } from './Mascot'
import { IS_IPHONE, MAIL_SERVER_URL } from '../../constants'
import { userPropertiesAtom } from '../../hooks/useLogin'
import { Alias } from '../../api'
import { RouterLink } from '../RouterLink'

const Container = styled(Center)`
  flex-direction: column;
  width: 100%;

  .header {
    margin-bottom: 32px;
    text-align: center;
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
    boxShadow={
      isChecked ? `0px 0px 10px 4px rgba(25, 25, 100, 0.1)` : undefined
    }
    borderRadius="8px"
    border={isChecked ? '1px solid #4E52F5' : '1px solid #e7e7e7'}
    padding="10px 16px 10px 16px"
    w="100%"
  >
    <Text fontSize="14px">{emailAddress}</Text>
    {isLoading ? (
      <Spinner />
    ) : IS_IPHONE ? (
      <Switch
        colorScheme="deepBlue"
        isReadOnly={isChecked}
        isChecked={isChecked}
        onChange={onChange(uuid, address)}
      />
    ) : (
      <>
        <Switch
          colorScheme="deepBlue"
          isReadOnly={isChecked}
          isChecked={isChecked}
          onChange={onChange(uuid, address)}
          display={['none', 'none', 'block']}
        />
        <Checkbox
          colorScheme="deepBlue"
          isReadOnly={isChecked}
          top="2px"
          isChecked={isChecked}
          onChange={onChange(uuid, address)}
          display={['block', 'block', 'none']}
        />
      </>
    )}
  </Flex>
)

const generateEmailAddress = (s = '') => {
  const [, domain] = s.split('.eth')
  if (domain) {
    return s
  }
  const [address, rest] = s.split('@')
  return `${truncateMiddle(address, 6, 4)}@${
    rest || MAIL_SERVER_URL
  }`.toLowerCase()
}

const ENS_DOMAIN = 'https://app.ens.domains'

export const SettingAddress: React.FC = () => {
  const [t] = useTranslation('settings')
  const account = useAccount()
  const api = useAPI()
  const [activeAccount, setActiveAccount] = useState(account)
  const [isRefreshing, setIsRefeshing] = useState(false)
  const toast = useToast()
  const dialog = useDialog()
  const trackClickENSRefresh = useTrackClick(TrackEvent.ClickENSRefresh)
  const setUserProperties = useUpdateAtom(userPropertiesAtom)
  const trackClickRegisterENS = useTrackClick(TrackEvent.ClickRegisterENS)
  const trackNext = useTrackClick(TrackEvent.ClickAddressNext)

  const {
    data: ensNames,
    isLoading,
    refetch,
  } = useQuery(
    [Query.ENS_NAMES, account],
    async () => {
      const { data } = await api.getAliases()
      return data
    },
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

  const onRefreshEnsDomains = async () => {
    setIsRefeshing(true)
    trackClickENSRefresh()
    try {
      await api.updateAliasList()
      await refetch()
    } catch (e: any) {
      if (e.response.data.reason !== 'EMPTY_ENS_LIST') {
        toast(t('address.refresh_failed') + e.toString())
      }
    } finally {
      setIsRefeshing(false)
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

  const aliases = useMemo(() => {
    if (ensNames?.aliases) {
      return ensNames?.aliases.sort((a) => {
        const [addr] = a.address.split('@')
        if (isPrimitiveEthAddress(addr)) {
          return -1
        }
        return 0
      })
    }
    return []
  }, [ensNames])

  const [firstAlias, ...restAliases] = aliases

  const router = useLocation()

  const refreshButton = (
    <RowButton
      variant="link"
      colorScheme="deepBlue"
      leftIcon={<Icon as={RefreshSvg} w="14px" h="14px" />}
      onClick={onRefreshEnsDomains}
      isLoading={isRefreshing}
    >
      {t('address.refresh')}
    </RowButton>
  )

  return (
    <Container>
      <header className="header">
        <Heading fontSize={['14px', '14px', '18px']}>
          {t('address.title')}
        </Heading>
        <Text fontSize={['14px', '14px', '18px']}>{t('address.desc')}</Text>
      </header>
      <FormControl maxW="480px">
        <FormLabel
          fontSize="16px"
          mb="8px"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <Stack
            direction="row"
            spacing="16px"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Text fontWeight={600} as="span">
              {`${t('address.wallet-address')}@${MAIL_SERVER_URL}`}
            </Text>
            <HStack spacing="4px">
              <CheckCircleIcon color="#4E52F5" w="12px" />
              <Text fontWeight={500} color="#4E52F5">
                {t('address.default')}
              </Text>
            </HStack>
            <Tooltip label={t('address.default-hover')}>
              <QuestionOutlineIcon cursor="pointer" w="16px" color="#4E52F5" />
            </Tooltip>
          </Stack>
        </FormLabel>
        <EmailSwitch
          uuid={firstAlias?.uuid ?? 'first_alias'}
          emailAddress={generateEmailAddress(firstAlias?.address ?? account)}
          account={firstAlias?.address}
          onChange={onDefaultAccountChange}
          key={firstAlias?.address}
          address={firstAlias?.address ?? account}
          isLoading={isLoading}
          isChecked={firstAlias?.uuid === activeAccount || aliases.length === 1}
        />
        {restAliases.length && !isLoading ? (
          <>
            <FormLabel fontSize="16px" fontWeight={700} mb="8px" mt="32px">
              <Stack
                direction="row"
                spacing="16px"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Box h="24px" lineHeight="24px">
                  {t('address.ens-name')}
                </Box>
                {refreshButton}
              </Stack>
            </FormLabel>
            <VStack spacing="10px">
              {restAliases.map((a) => (
                <EmailSwitch
                  uuid={a.uuid}
                  address={a.address}
                  emailAddress={generateEmailAddress(a.address)}
                  account={a.address}
                  onChange={onDefaultAccountChange}
                  key={a.address}
                  isChecked={a.uuid === activeAccount}
                />
              ))}
            </VStack>
          </>
        ) : null}
        <Text fontSize="16px" fontWeight={700} mt="32px" mb="32px">
          <Stack
            direction="row"
            spacing="16px"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Box h="24px" lineHeight="24px">
              <Trans
                ns="settings"
                i18nKey="address.registe-ens"
                t={t}
                components={{
                  a: (
                    <Link
                      isExternal
                      onClick={() => trackClickRegisterENS()}
                      href={ENS_DOMAIN}
                      color="#4E52F5"
                    />
                  ),
                }}
              />
            </Box>
            {restAliases.length <= 0 ? refreshButton : null}
          </Stack>
        </Text>
      </FormControl>
      <Flex className="mascot">
        <Mascot src={happySetupMascot} />
      </Flex>
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
