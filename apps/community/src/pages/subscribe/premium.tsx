import { Box, Grid } from '@chakra-ui/layout'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Link,
  ListItem,
  OrderedList,
  Text,
  Tooltip,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { AliasMailType } from 'models'
import { isBitDomain, removeMailSuffix } from 'shared'
import { useDialog } from 'hooks'
import { Container } from '../../components/Container'
import { TipsPanel } from '../../components/TipsPanel'
import { ReactComponent as QuestionSvg } from '../../assets/Question.svg'
import { StatusLamp } from '../../components/StatusLamp'
import { useAPI } from '../../hooks/useAPI'
import { UserPremiumSettingState } from '../../api/modals/UserPremiumSetting'
import { QueryKey } from '../../api/QueryKey'
import { PremiumDotBitSubdomainVerifyForm } from '../../components/PremiumPageComponents'
import { PremiumSubdomainStep } from '../../components/PremiumPageComponents/PremiumSubdomainStep'
import {
  SubDomainState,
  useVerifyPremiumDotBitDomainState,
} from '../../hooks/premium/useVerifyPremiumDotBitDomainState'
import { ErrorCode } from '../../api/ErrorCode'
import {
  CONTACT_URL,
  DAODID_URL,
  DOT_BIT_URL,
  SELL_HELP_DOCUMENT_URL,
  SUPER_DID_URL,
} from '../../constants/env/url'
import { useToast } from '../../hooks/useToast'

export const Premium: React.FC = () => {
  const { t } = useTranslation(['premium', 'common'])
  const api = useAPI()
  const [verifyDomainValue, setVerifyDomainValue] = useState('')
  const [isSetVerifyDomainValue, setIsSetVerifyDomainValue] = useState(false)
  const [isUpdatingPremiumSetting, setIsUpdatingPremiumSetting] =
    useState(false)
  const [subdomainState, setSubdomainState] = useState<
    SubDomainState | undefined
  >(undefined)
  const [verifyDomainErrorMessage, setVerifyDomainErrorMessage] = useState('')
  const toast = useToast()
  const confirm = useDialog()
  const { data, isLoading, refetch } = useQuery(
    [QueryKey.GetUserPremiumSettings],
    async () => api.getUserPremiumSettings().then((res) => res.data),
    {
      async onSuccess(d) {
        if (!isSetVerifyDomainValue) {
          setIsSetVerifyDomainValue(true)
          if (d.dot_bit_account) {
            setVerifyDomainValue(d.dot_bit_account)
            return
          }
          const dotBitItem = await api
            .getAliases()
            .then((res) =>
              res.data.aliases.find(
                (alias) => alias.email_type === AliasMailType.Bit
              )
            )
          if (dotBitItem) {
            setVerifyDomainValue(removeMailSuffix(dotBitItem.address))
          }
        }
      },
    }
  )
  const verifyDotBitDomainState = useVerifyPremiumDotBitDomainState()

  const transComponents = {
    h3: <Heading as="h3" fontSize="18px" mt="32px" mb="12px" />,
    ul: <UnorderedList />,
    ol: <OrderedList />,
    li: <ListItem fontSize="14px" fontWeight="500" />,
    p: <Text fontSize="14px" fontWeight="500" />,
    contact: <Link href={CONTACT_URL} target="_blank" color="primary.900" />,
    bit: <Link href={DOT_BIT_URL} target="_blank" color="primary.900" />,
    daodid: <Link href={SUPER_DID_URL} target="_blank" color="primary.900" />,
    detail: (
      <Link href={SELL_HELP_DOCUMENT_URL} target="_blank" color="primary" />
    ),
  }

  const getDotBitDomainState = async () => {
    if (verifyDotBitDomainState.isLoading) return
    if (!isBitDomain(verifyDomainValue)) {
      setVerifyDomainErrorMessage(t('is_not_dot_bit_address'))
      return
    }
    try {
      const r = await verifyDotBitDomainState.onVerify(verifyDomainValue)
      setSubdomainState(r)
    } catch (err: any) {
      const errorReason = err?.response?.data?.reason
      const errorMessage =
        (
          {
            [ErrorCode.INVALID_PREMIUM_SETTING_ACCOUNT]: t(
              'is_not_dot_bit_address'
            ),
            [ErrorCode.NOT_OWNED_THE_DOT_BIT_ACCOUNT]: t('is_not_owner'),
          } as { [key in ErrorCode]?: string }
        )[errorReason as ErrorCode] ||
        err?.message?.data?.message ||
        t('unknown_error')
      setVerifyDomainErrorMessage(errorMessage)
    }
  }

  const onUpdatePremiumSetting = (state: UserPremiumSettingState) => {
    if (!isBitDomain(verifyDomainValue)) {
      setVerifyDomainErrorMessage(t('is_not_dot_bit_address'))
      return
    }
    async function action() {
      if (isUpdatingPremiumSetting) return
      setIsUpdatingPremiumSetting(true)
      try {
        await api.updateUserPremiumSettings(verifyDomainValue, {
          state,
        })
        await refetch()
      } catch (err: any) {
        toast(
          err?.response?.data?.message ||
            err?.message ||
            t('unknown_error', { ns: 'common' })
        )
      } finally {
        setIsUpdatingPremiumSetting(false)
      }
    }
    if (state === UserPremiumSettingState.Enabled) {
      confirm({
        title: t('enable_confirm_dialog.title'),
        description: (
          <Trans
            t={t}
            i18nKey="enable_confirm_dialog.description"
            components={transComponents}
          />
        ),
        onConfirm: action,
        okText: t('confirm'),
      })
    }
    if (state === UserPremiumSettingState.Disabled) {
      confirm({
        title: t('disable_confirm_dialog.title'),
        description: (
          <Trans
            t={t}
            i18nKey="disable_confirm_dialog.description"
            components={transComponents}
          />
        ),
        onConfirm: action,
        okText: t('confirm'),
        okButtonProps: {
          colorScheme: 'red',
        },
      })
    }
  }

  return (
    <Container
      as={Grid}
      gridTemplateColumns="calc(calc(calc(100% - 20px) / 4) * 3) calc(calc(100% - 20px) / 4)"
      gap="20px"
      position="relative"
    >
      <Box bg="cardBackground" shadow="card" rounded="card" p="32px">
        <VStack spacing="32px" w="full" alignItems="flex-start">
          <Flex justify="space-between" w="full">
            <Heading as="h4" fontSize="18px" lineHeight="20px">
              {t('title')}
            </Heading>
            <StatusLamp
              isLoading={isLoading}
              isEnabled={data?.state === UserPremiumSettingState.Enabled}
            />
          </Flex>
          <Text fontSize="16px" fontWeight={500} lineHeight="26px">
            <Trans t={t} i18nKey="contact_us" components={transComponents} />
          </Text>
          <Flex direction="column">
            <FormControl isInvalid={!!verifyDomainErrorMessage}>
              <FormLabel>
                <Trans
                  t={t}
                  i18nKey="domain_field"
                  components={transComponents}
                />
              </FormLabel>
              <PremiumDotBitSubdomainVerifyForm
                value={verifyDomainValue}
                onChange={(v) => {
                  setVerifyDomainErrorMessage('')
                  setVerifyDomainValue(v)
                  setSubdomainState(undefined)
                }}
                isDisabled={
                  isLoading || data?.state === UserPremiumSettingState.Enabled
                }
                isLoading={verifyDotBitDomainState.isLoading}
                onConfirm={() => getDotBitDomainState()}
              />
              <FormErrorMessage>{verifyDomainErrorMessage}</FormErrorMessage>
            </FormControl>
            <PremiumSubdomainStep
              state={subdomainState}
              isLoading={verifyDotBitDomainState.isLoading}
              reloadState={getDotBitDomainState}
            />
          </Flex>
          {subdomainState === ErrorCode.DOT_BIT_ACCOUNT_NOT_SET_LOWEST_PRICE ? (
            <Flex color="primary.900">
              <Button
                as="a"
                href={DAODID_URL}
                target="_blank"
                variant="outline-rounded"
                colorScheme="primaryButton"
              >
                {t('set_up_sales_strategy')}
              </Button>
              <Tooltip
                label={t('set_up_sales_strategy_tips')}
                placement="top"
                hasArrow
              >
                <Button variant="link" colorScheme="primaryButton" ml="4px">
                  <Icon as={QuestionSvg} w="20px" h="20px" my="auto" />
                </Button>
              </Tooltip>
            </Flex>
          ) : null}
          {data?.state === UserPremiumSettingState.Enabled ? (
            <Button
              variant="solid-rounded"
              colorScheme="red"
              type="submit"
              isLoading={isUpdatingPremiumSetting}
              onClick={() =>
                onUpdatePremiumSetting(UserPremiumSettingState.Disabled)
              }
            >
              {t('disable')}
            </Button>
          ) : (
            <Button
              variant="solid-rounded"
              colorScheme="primaryButton"
              type="submit"
              isDisabled={
                subdomainState !== null ||
                !!verifyDomainErrorMessage ||
                !verifyDomainValue
              }
              isLoading={isUpdatingPremiumSetting}
              onClick={() =>
                onUpdatePremiumSetting(UserPremiumSettingState.Enabled)
              }
            >
              {t('enable')}
            </Button>
          )}
        </VStack>
      </Box>
      <TipsPanel>
        <Trans t={t} i18nKey="help" components={transComponents} />
      </TipsPanel>
    </Container>
  )
}
