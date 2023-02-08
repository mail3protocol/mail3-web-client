import {
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { useState } from 'react'
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
}

export const PremiumDotBitSubdomainVerifyForm: React.FC<
  PremiumDotBitSubdomainVerifyFormProps
> = ({ onConfirm }) => {
  const { t } = useTranslation(['premium', 'common'])
  const [inputValue, setInputValue] = useState('')
  const api = useAPI()
  const onVerifyDotBitState = async () => {
    const reason = await api
      .updateUserPremiumSettings(inputValue)
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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputValue ? (
          <InputRightElement>
            <Button
              variant="unstyled"
              display="inline-flex"
              onClick={() => setInputValue('')}
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
        isDisabled={!inputValue}
      >
        {t('confirm')}
      </Button>
    </Flex>
  )
}
