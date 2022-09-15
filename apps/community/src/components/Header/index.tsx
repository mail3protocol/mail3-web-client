import { Box, Flex } from '@chakra-ui/react'
import { Logo } from 'ui/src/Logo'
import { useTranslation } from 'react-i18next'

export const HEADER_HEIGHT = 60

export const Header: React.FC = () => {
  const { t } = useTranslation('components')
  return (
    <Flex
      h={`${HEADER_HEIGHT}px`}
      w="full"
      px="20px"
      shadow="md"
      position="fixed"
      top="0"
      left="0"
      zIndex="header"
      bg="headerBackground"
    >
      <Flex align="center" userSelect="none">
        <Logo />
        <Box
          as="span"
          ml="8px"
          color="primary.900"
          fontWeight="bold"
          fontSize="18px"
        >
          {t('header.logo_name')}
        </Box>
      </Flex>
    </Flex>
  )
}
