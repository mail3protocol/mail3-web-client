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
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import NextLink from 'next/link'
import {
  ChevronRightIcon,
  CheckCircleIcon,
  QuestionOutlineIcon,
} from '@chakra-ui/icons'
import { useUpdateAtom } from 'jotai/utils'
import { useTranslation, Trans } from 'next-i18next'
import React, { useMemo, useState } from 'react'
import { Button } from 'ui'
import { useAccount, useDialog } from 'hooks'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { truncateMiddle, isPrimitiveEthAddress } from 'shared'
import { useAPI } from '../../hooks/useAPI'
import { Query } from '../../api/query'
import happySetupMascot from '../../assets/happy-setup-mascot.png'
import { RoutePath } from '../../route/path'
import { Mascot } from './Mascot'
import { MAIL_SERVER_URL } from '../../constants'
import { userPropertiesAtom } from '../../hooks/useLogin'

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
  const [activeAcount, setActiveAccount] = useState(account)
  const dialog = useDialog()

  const { data: ensNames, isLoading } = useQuery(
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
        for (let i = 0; i < d.aliases.length; i++) {
          const alias = d.aliases[i]
          if (alias.is_default) {
            setActiveAccount(alias.uuid)
          }
        }
      },
    }
  )

  const setUserInfo = useUpdateAtom(userPropertiesAtom)
  const onDefaultAccountChange =
    (uuid: string, address: string) => async () => {
      const prevActiveAccount = activeAcount
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
        if (isPrimitiveEthAddress(a.address)) {
          return -1
        }
        return 0
      })
    }
    return []
  }, [ensNames])

  const [firstAlias, ...restAliases] = aliases

  const router = useRouter()

  return (
    <Container>
      <header className="header">
        <Heading fontSize={['14px', '14px', '18px']}>
          {t('address.title')}
        </Heading>
        <Text fontSize={['14px', '14px', '18px']}>{t('address.desc')}</Text>
      </header>
      <FormControl maxW="480px">
        <FormLabel fontSize="16px" mb="8px">
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
          isChecked={firstAlias?.uuid === activeAcount || aliases.length === 1}
        />
        {restAliases.length && !isLoading ? (
          <>
            <FormLabel fontSize="16px" fontWeight={700} mb="8px" mt="32px">
              {t('address.ens-name')}
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
                  isChecked={a.uuid === activeAcount}
                />
              ))}
            </VStack>
          </>
        ) : null}
        <Text fontSize="16px" fontWeight={700} mt="32px" mb="32px">
          <Trans
            ns="settings"
            i18nKey="address.registe-ens"
            t={t}
            components={{
              a: <Link isExternal href={ENS_DOMAIN} color="#4E52F5" />,
            }}
          />
        </Text>
      </FormControl>
      <Flex className="mascot">
        <Mascot src={happySetupMascot.src} />
      </Flex>
      {(router.pathname as any) !== RoutePath.Settings ? (
        <Center className="footer" w="full">
          <NextLink href={RoutePath.SetupSignature} passHref>
            <Button
              bg="black"
              color="white"
              w="250px"
              height="50px"
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
          </NextLink>
        </Center>
      ) : null}
    </Container>
  )
}
