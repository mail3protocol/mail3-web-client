import { Box } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { Flex, FlexProps } from '@chakra-ui/react'

export const StatusLamp: React.FC<
  FlexProps & {
    isLoading?: boolean
    isEnabled?: boolean
  }
> = ({ isLoading, isEnabled, ...props }) => {
  const { t } = useTranslation('common')
  return (
    <Flex
      ml="auto"
      color="secondaryTitleColor"
      fontSize="16px"
      fontWeight="500"
      align="center"
      {...props}
    >
      {t('status_field')}
      <Box
        w="8px"
        h="8px"
        bg={isEnabled ? 'statusColorEnabled' : 'statusColorDisabled'}
        rounded="full"
        ml="8px"
        mr="4px"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
      <Box color="primaryTextColor" w="72px">
        {!isLoading
          ? t(isEnabled ? 'status_value.enabled' : 'status_value.disabled')
          : t('status_value.loading')}
      </Box>
    </Flex>
  )
}
