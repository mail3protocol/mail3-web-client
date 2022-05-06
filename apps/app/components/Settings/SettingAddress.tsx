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
  QuestionIcon,
} from '@chakra-ui/icons'
import { useTranslation, Trans } from 'next-i18next'
import React, { useState } from 'react'
import { Button } from 'ui'
import { useAccount, useDialog } from 'hooks'
import { useQuery } from 'react-query'
import { useEmailAddress } from '../../hooks/useEmailAddress'
import { useAPI } from '../../hooks/useAPI'
import { Query } from '../../api/query'
import happySetupMascot from '../../assets/happy-setup-mascot.png'
import { RoutePath } from '../../route/path'
import { Mascot } from './Mascot'

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
  isChecked: boolean
  // eslint-disable-next-line prettier/prettier
  onChange: (account: string) => (e: React.ChangeEvent<HTMLInputElement>) => void
}

const EmailSwitch: React.FC<EmailSwitchProps> = ({
  emailAddress,
  account,
  onChange,
  isLoading = false,
  isChecked,
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
          onChange={onChange(account)}
          display={['none', 'none', 'block']}
        />
        <Checkbox
          colorScheme="deepBlue"
          isReadOnly={isChecked}
          top="2px"
          isChecked={isChecked}
          onChange={onChange(account)}
          display={['block', 'block', 'none']}
        />
      </>
    )}
  </Flex>
)

const generateEmailAddress = (s: string) => `${s}@mail.me`

const ENS_DOMAIN = 'https://app.ens.domains'

export const SettingAddress: React.FC = () => {
  const [t] = useTranslation('settings')
  const emailAddress = useEmailAddress()
  const account = useAccount()
  const api = useAPI()
  const [activeAcount, setActiveAccount] = useState(account)
  const dialog = useDialog()

  const { data: ensNames, isLoading } = useQuery(
    [Query.ENS_NAMES, account],
    async () => {
      const { data } = await api.getENSNames()
      return data
    },
    {
      enabled: !!account,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        if (d.active_account) {
          setActiveAccount(d.active_account)
        } else {
          setActiveAccount(account)
        }
      },
    }
  )

  const onDefaultAccountChange = (address: string) => async () => {
    const prevActiveAccount = activeAcount
    try {
      setActiveAccount(address)
      await api.setDefaultSentAddress(address)
    } catch (error) {
      setActiveAccount(prevActiveAccount)
      dialog({
        type: 'warning',
        description: t('address.request-failed'),
      })
    }
  }

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
              {generateEmailAddress(t('address.wallet-address'))}
            </Text>
            <HStack spacing="4px">
              <CheckCircleIcon color="#4E52F5" w="12px" />
              <Text fontWeight={500}>{t('address.default')}</Text>
            </HStack>
            <Tooltip label={t('address.default-hover')}>
              <QuestionIcon cursor="pointer" w="16px" color="#4E52F5" />
            </Tooltip>
          </Stack>
        </FormLabel>
        <EmailSwitch
          emailAddress={emailAddress}
          account={account!}
          isLoading={isLoading}
          onChange={onDefaultAccountChange}
          isChecked={account === activeAcount}
        />
        {ensNames?.ens_names?.length && !isLoading ? (
          <>
            <FormLabel fontSize="16px" fontWeight={700} mb="8px" mt="32px">
              {t('address.ens-name')}
            </FormLabel>
            <VStack spacing="10px">
              {ensNames.ens_names.map((addr) => (
                <EmailSwitch
                  emailAddress={generateEmailAddress(addr)}
                  account={addr}
                  onChange={onDefaultAccountChange}
                  key={addr}
                  isChecked={addr === activeAcount}
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
    </Container>
  )
}
