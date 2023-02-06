import { Grid, Box } from '@chakra-ui/layout'
import {
  Flex,
  Heading,
  VStack,
  Text,
  Link,
  FormControl,
  FormLabel,
  Input,
  Button,
  Icon,
  Tooltip,
  UnorderedList,
  OrderedList,
  ListItem,
} from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { Container } from '../../components/Container'
import { TipsPanel } from '../../components/TipsPanel'
import { SubscriptionState } from '../../api/modals/SubscriptionResponse'
import { ReactComponent as QuestionSvg } from '../../assets/Question.svg'

export const Premium: React.FC = () => {
  const { t } = useTranslation(['premium', 'common'])
  const isLoading = false
  const state = SubscriptionState.Inactive

  const transComponents = {
    h3: <Heading as="h3" fontSize="18px" mt="32px" mb="12px" />,
    ul: <UnorderedList />,
    ol: <OrderedList />,
    li: <ListItem fontSize="14px" fontWeight="400" />,
    p: <Text fontSize="14px" fontWeight="400" />,
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
            <Flex
              ml="auto"
              color="secondaryTitleColor"
              fontSize="16px"
              fontWeight="500"
              align="center"
            >
              {t('status_field', { ns: 'common' })}
              <Box
                w="8px"
                h="8px"
                bg={
                  state === SubscriptionState.Inactive
                    ? 'statusColorDisabled'
                    : 'statusColorEnabled'
                }
                rounded="full"
                ml="8px"
                mr="4px"
                style={{ opacity: isLoading ? 0 : 1 }}
              />
              <Box color="primaryTextColor" w="72px">
                {!isLoading
                  ? t(
                      state === SubscriptionState.Inactive
                        ? 'status_value.disabled'
                        : 'status_value.enabled',
                      { ns: 'common' }
                    )
                  : t('status_value.loading', { ns: 'common' })}
              </Box>
            </Flex>
          </Flex>
          <Text fontSize="16px" fontWeight={500} lineHeight="26px">
            <Trans t={t} i18nKey="contact_us" components={transComponents} />
          </Text>
          <FormControl>
            <FormLabel>
              <Trans
                t={t}
                i18nKey="domain_field"
                components={transComponents}
              />
            </FormLabel>
            <Flex>
              <Input w="338px" />
              <Button
                variant="link"
                ml="24px"
                fontSize="14px"
                colorScheme="primaryButton"
              >
                {t('confirm')}
              </Button>
            </Flex>
          </FormControl>
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
        </VStack>
      </Box>
      <TipsPanel>
        <Trans t={t} i18nKey="help" components={transComponents} />
      </TipsPanel>
    </Container>
  )
}
