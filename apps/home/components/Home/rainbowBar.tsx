import React from 'react'
import { Box, Center, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useTranslation } from 'next-i18next'
import styled from '@emotion/styled'
import { isBetaTestingStage, isWhiteListStage } from '../../utils'
import { WHITE_LIST_URL } from '../../constants/env'

export const RainbowBarContainer = styled(Center)`
  background: linear-gradient(
    90deg,
    #ffb1b1,
    #ffcd4b,
    #916bff,
    #ffb1b1,
    #ffdc81,
    #d9ff89,
    #c6b2ff,
    #ffb1b1
  );
  background-size: 400% 400%;
  animation: run-text-bg 20s linear infinite;
  @keyframes run-text-bg {
    0% {
      background-position: 0 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
`

export const RainbowBar: React.FC = () => {
  const { t } = useTranslation('index')
  return (
    <RainbowBarContainer
      position="sticky"
      minH="44px"
      textAlign="center"
      py="6px"
      px="20px"
      top="0"
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
            <NextLink href={WHITE_LIST_URL}>
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
    </RainbowBarContainer>
  )
}
