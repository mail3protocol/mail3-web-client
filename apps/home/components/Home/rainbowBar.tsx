import React, { useMemo } from 'react'
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
  animation: run-rainbow-bar-bg 10s linear infinite;
  @keyframes run-rainbow-bar-bg {
    0% {
      background-position: 0 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
`

export const RainbowBar: React.FC = () => {
  const { t } = useTranslation('index')
  const contentEl = useMemo(() => {
    if (isWhiteListStage()) {
      return (
        <>
          {t('heading-banner-text.white-list')}

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
      )
    }
    if (isBetaTestingStage()) {
      return (
        <>
          {t('heading-banner-text.beta-testing')}
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
      )
    }
    return null
  }, [])

  return (
    <RainbowBarContainer
      minH="44px"
      maxH="44px"
      textAlign="center"
      py="6px"
      px="20px"
      top="0"
      fontSize={{
        base: '12px',
        md: '20px',
      }}
    >
      <Box>{contentEl}</Box>
    </RainbowBarContainer>
  )
}
