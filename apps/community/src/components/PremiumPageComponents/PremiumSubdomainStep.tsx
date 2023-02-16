import { Link, VStack } from '@chakra-ui/react'
import { Box } from '@chakra-ui/layout'
import { Trans, useTranslation } from 'react-i18next'
import { ReactNode, useMemo } from 'react'
import { Step, StepStatus } from './Step'
import { ErrorCode } from '../../api/ErrorCode'
import { SubDomainState } from '../../hooks/premium/useVerifyPremiumDotBitDomainState'

export const PremiumSubdomainStep: React.FC<{
  state?: SubDomainState
  reloadState?: () => void
  isLoading?: boolean
  domain?: string
}> = ({ state, reloadState, isLoading }) => {
  const { t } = useTranslation('premium')
  const stepStatus = useMemo(() => {
    if (state === ErrorCode.DOT_BIT_ACCOUNT_NOT_OPENED) {
      return [StepStatus.Failed, StepStatus.Pending]
    }
    if (state === ErrorCode.DOT_BIT_ACCOUNT_NOT_SET_LOWEST_PRICE) {
      return [
        StepStatus.Done,
        isLoading ? StepStatus.Loading : StepStatus.Failed,
      ]
    }
    if (state === null) {
      return [StepStatus.Done, StepStatus.Done]
    }
    return [
      isLoading ? StepStatus.Loading : StepStatus.Pending,
      isLoading ? StepStatus.Loading : StepStatus.Pending,
    ]
  }, [state, isLoading])

  return (
    <VStack mt="18px" spacing="10px" maxW="660px">
      <Step serialNumber={1} status={stepStatus[0]}>
        {(
          {
            [StepStatus.Done]: t('enabled_subdomain'),
            [StepStatus.Pending]: t('waiting_enable_subdomain'),
            [StepStatus.Failed]: t('failed_enable_subdomain'),
            [StepStatus.Loading]: t('verifying_enable_subdomain'),
          } as { [key in StepStatus]?: ReactNode }
        )[stepStatus[0]] || t('waiting_enable_subdomain')}
      </Step>
      <Box
        w="full"
        h="24px"
        transform="translateX(10px)"
        borderLeft="1px solid"
        borderColor="uneditable"
      />
      <Step serialNumber={2} status={stepStatus[1]} h="40px">
        {(
          {
            [StepStatus.Failed]: (
              <Trans
                t={t}
                i18nKey="failed_enable_subdomain_price"
                components={{
                  retry: (
                    <Link
                      onClick={() => reloadState?.()}
                      display="contents"
                      fontWeight={700}
                      color="primary.900"
                      textDecoration="underline"
                    />
                  ),
                }}
              />
            ),
            [StepStatus.Done]: t('enabled_subdomain_price'),
            [StepStatus.Loading]: t('verifying_enable_subdomain_price'),
          } as { [key in StepStatus]?: ReactNode }
        )[stepStatus[1]] || t('waiting_enable_subdomain_price')}
      </Step>
    </VStack>
  )
}
