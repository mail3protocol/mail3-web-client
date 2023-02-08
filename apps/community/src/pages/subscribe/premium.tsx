import { Grid, Box } from '@chakra-ui/layout'
import {
  Flex,
  Heading,
  VStack,
  Text,
  Link,
  FormControl,
  FormLabel,
  Button,
  Icon,
  Tooltip,
  UnorderedList,
  OrderedList,
  ListItem,
} from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useState } from 'react'
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
  SUPER_DID_URL,
} from '../../constants/env/url'

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
  const { data, isLoading, refetch } = useQuery(
    [QueryKey.GetUserPremiumSettings],
    async () => api.getUserPremiumSettings().then((res) => res.data),
    {
      onSuccess(d) {
        if (!isSetVerifyDomainValue) {
          setIsSetVerifyDomainValue(true)
          setVerifyDomainValue(d.dot_bit_account)
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
    superdid: <Link href={SUPER_DID_URL} target="_blank" color="primary.900" />,
  }

  const getDotBitDomainState = async (v?: string) => {
    if (verifyDotBitDomainState.isLoading) return
    const r = await verifyDotBitDomainState.onVerify(v || verifyDomainValue)
    setSubdomainState(r)
  }

  const onUpdatePremiumSetting = async (state: UserPremiumSettingState) => {
    if (isUpdatingPremiumSetting) return
    setIsUpdatingPremiumSetting(true)
    await api.updateUserPremiumSettings(verifyDomainValue, {
      state,
    })
    await refetch()
    setIsUpdatingPremiumSetting(false)
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
            <FormControl>
              <FormLabel>
                <Trans
                  t={t}
                  i18nKey="domain_field"
                  components={transComponents}
                />
              </FormLabel>
              <PremiumDotBitSubdomainVerifyForm
                value={verifyDomainValue}
                onChange={setVerifyDomainValue}
                isDisabled={
                  isLoading || data?.state === UserPremiumSettingState.Enabled
                }
                isLoading={verifyDotBitDomainState.isLoading}
                onConfirm={() => getDotBitDomainState()}
              />
            </FormControl>
            <PremiumSubdomainStep
              state={subdomainState}
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
              isDisabled={subdomainState !== null}
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
