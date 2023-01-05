import { Box, BoxProps, Flex, FlexProps } from '@chakra-ui/react'
import { Logo } from 'ui/src/Logo'
import { useTranslation } from 'react-i18next'

export const HEADER_HEIGHT = 60

export const Header: React.FC<
  FlexProps & {
    logoNameProps?: BoxProps
  }
> = ({ logoNameProps, children, ...props }) => {
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
      {...props}
    >
      <Flex align="center" userSelect="none">
        <Logo isHiddenText />
        <Box
          as="span"
          ml="8px"
          fontWeight="bold"
          fontSize="18px"
          {...logoNameProps}
        >
          {t('header.logo_name')}
        </Box>
      </Flex>
      {children}
    </Flex>
  )
}
