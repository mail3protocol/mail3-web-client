import { Flex, Heading, FlexProps } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Button } from 'ui'
import React, { ReactNode } from 'react'
import LogoSvg from 'assets/svg/logo.svg'
import { useTranslation } from 'next-i18next'
import { APP_URL } from '../../constants/env'

export interface NavbarProps extends FlexProps {
  headingText?: ReactNode | string
  button?: ReactNode
}

export const Navbar: React.FC<NavbarProps> = ({
  headingText,
  button,
  ...props
}) => {
  const { t } = useTranslation('navbar')
  return (
    <Flex
      justify="space-between"
      h="60px"
      align="center"
      px={{
        base: '20px',
        md: '40px',
      }}
      w="full"
      maxW="1300px"
      transition="200ms"
      {...props}
    >
      <LogoSvg />
      <Flex>
        <Heading
          fontSize="28px"
          mr="22px"
          h="40px"
          lineHeight="40px"
          display={{
            base: 'none',
            md: 'block',
          }}
        >
          {headingText}
        </Heading>
        {button || (
          <NextLink href={APP_URL}>
            <Button shadow="0 4px 4px rgba(0, 0, 0, 0.25)" px="40px">
              {t('launch-app')}
            </Button>
          </NextLink>
        )}
      </Flex>
    </Flex>
  )
}
