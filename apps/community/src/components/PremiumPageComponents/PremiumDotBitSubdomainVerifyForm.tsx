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

export interface PremiumDotBitSubdomainVerifyFormProps {
  onConfirm?: (value: string) => void
  value?: string
  onChange?: (value: string) => void
  isDisabled?: boolean
  isLoading?: boolean
}

export const PremiumDotBitSubdomainVerifyForm: React.FC<
  PremiumDotBitSubdomainVerifyFormProps
> = ({ onConfirm, value = '', onChange, isDisabled, isLoading }) => {
  const { t } = useTranslation(['premium', 'common'])
  return (
    <Flex
      as="form"
      onSubmit={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onConfirm?.(value)
      }}
    >
      <InputGroup w="338px">
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          isDisabled={isDisabled}
        />
        {value && !isDisabled ? (
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
        type="submit"
        variant="link"
        ml="24px"
        fontSize="14px"
        colorScheme="primaryButton"
        isDisabled={!value || isDisabled}
        isLoading={isLoading}
      >
        {t('confirm')}
      </Button>
    </Flex>
  )
}
