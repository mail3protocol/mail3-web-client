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
import {
  Step,
  StepStatus,
  PremiumDotBitSubdomainVerifyForm,
} from '../../components/PremiumPageComponents'

export const Premium: React.FC = () => {
  const { t } = useTranslation(['premium', 'common'])
  const api = useAPI()
  const [verifyDomainValue, setVerifyDomainValue] = useState('')
  const { data, isLoading } = useQuery(
    [QueryKey.GetUserPremiumSettings],
    async () => api.getUserPremiumSettings().then((res) => res.data),
    {
      onSuccess(d) {
        setVerifyDomainValue(d.dot_bit_account)
      },
    }
  )

  const transComponents = {
    h3: <Heading as="h3" fontSize="18px" mt="32px" mb="12px" />,
    ul: <UnorderedList />,
    ol: <OrderedList />,
    li: <ListItem fontSize="14px" fontWeight="500" />,
    p: <Text fontSize="14px" fontWeight="500" />,
    contact: <Link href="/" target="_blank" color="primary.900" />,
    bit: <Link href="/" target="_blank" color="primary.900" />,
    superdid: <Link href="/" target="_blank" color="primary.900" />,
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
                isDisabled={isLoading}
              />
            </FormControl>
            <VStack mt="18px" spacing="10px">
              <Step serialNumber={1} status={StepStatus.Active}>
                {t('waiting_enable_subdomain')}
              </Step>
              <Box
                w="full"
                h="24px"
                transform="translateX(10px)"
                borderLeft="1px solid"
                borderColor="uneditable"
              />
              <Step serialNumber={2} status={StepStatus.Pending}>
                {t('waiting_enable_subdomain_price')}
              </Step>
            </VStack>
          </Flex>
          <Flex color="primary.900">
            <Button
              variant="outline-rounded"
              colorScheme="primaryButton"
              isDisabled
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
          {data?.state === UserPremiumSettingState.Disabled ? (
            <Button variant="solid-rounded" colorScheme="red" type="submit">
              {t('disable')}
            </Button>
          ) : (
            <Button
              variant="solid-rounded"
              colorScheme="primaryButton"
              type="submit"
              isDisabled
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
