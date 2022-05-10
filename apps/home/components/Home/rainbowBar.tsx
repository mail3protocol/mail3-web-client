import React from 'react'
import { Box, Center, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useTranslation } from 'next-i18next'
import { isBetaTestingStage, isWhiteListStage } from '../../utils/whitelist'

export const RainbowBar: React.FC = () => {
  const { t } = useTranslation('index')
  return (
    <Center
      bg="linear-gradient(90.02deg, #FFBEBE 0.01%, #FFDC81 31.73%, #D9FF89 58.81%, #C6B2FF 99.99%)"
      minH="44px"
      textAlign="center"
      py="6px"
      px="20px"
    >
      <Box>
        {isWhiteListStage() ? (
          <>
            {t('heading-banner-text.beta-testing')}
            <NextLink href="/testing">
              <Link
                fontWeight="bold"
                textDecoration="underline"
                display="inline-block"
              >
                {t('join')}
              </Link>
            </NextLink>
          </>
        ) : null}
        {isBetaTestingStage() ? (
          <>
            {t('heading-banner-text.white-list')}
            <NextLink href="/whitelist">
              <Link
                fontWeight="bold"
                textDecoration="underline"
                display="inline-block"
              >
                {t('join_white_list')}
              </Link>
            </NextLink>
          </>
        ) : null}
      </Box>
    </Center>
  )
}
