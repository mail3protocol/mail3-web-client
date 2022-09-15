import { Box, Flex, Input, InputProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export interface SubjectInputProps extends InputProps {
  limit?: number
  count?: number
}

export const SubjectInput: React.FC<SubjectInputProps> = ({
  limit = 60,
  count,
  value,
  ...props
}) => {
  const { t } = useTranslation('new_message')
  return (
    <Flex>
      <Input
        variant="unstyled"
        type="text"
        placeholder={t('subject')}
        fontWeight="bold"
        flex={1}
        fontSize="16px"
        maxLength={limit}
        rounded="0"
        {...props}
      />
      <Box
        whiteSpace="nowrap"
        fontSize="14px"
        ml="16px"
        color="secondaryTextColor"
      >
        {t('subject_limit', {
          count:
            count || typeof value === 'string' ? (value as string).length : 0,
          limit,
        })}
      </Box>
    </Flex>
  )
}
