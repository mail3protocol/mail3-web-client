import {
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as CleanInputIconSvg } from '../../assets/CleanInputIcon.svg'
import { useAPI } from '../../hooks/useAPI'
import { ErrorCode } from '../../api/ErrorCode'

export interface PremiumDotBitSubdomainVerifyFormProps {
  onConfirm?: (
    reason?:
      | ErrorCode.DOT_BIT_ACCOUNT_NOT_OPENED
      | ErrorCode.DOT_BIT_ACCOUNT_NOT_SET_LOWEST_PRICE
      | null
  ) => void
  value?: string
  onChange?: (value: string) => void
  isDisabled?: boolean
}

export const PremiumDotBitSubdomainVerifyForm: React.FC<
  PremiumDotBitSubdomainVerifyFormProps
> = ({ onConfirm, value = '', onChange, isDisabled }) => {
  const { t } = useTranslation(['premium', 'common'])
  const api = useAPI()
  const onVerifyDotBitState = async () => {
    const reason = await api
      .updateUserPremiumSettings(value)
      .then(() => null)
      .catch((err) => err?.response?.data?.reason)
    onConfirm?.(reason)
  }

  return (
    <Flex
      as="form"
      onSubmit={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onVerifyDotBitState()
      }}
    >
      <InputGroup w="338px">
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          isDisabled={isDisabled}
        />
        {value ? (
          <InputRightElement>
            <Button
              variant="unstyled"
              display="inline-flex"
              onClick={() => onChange?.('')}
            >
              <Icon as={CleanInputIconSvg} w="20px" h="20px" my="auto" />
            </Button>
          </InputRightElement>
        ) : null}
      </InputGroup>
      <Button
        variant="link"
        ml="24px"
        fontSize="14px"
        colorScheme="primaryButton"
        isDisabled={!value || isDisabled}
      >
        {t('confirm')}
      </Button>
    </Flex>
  )
}
