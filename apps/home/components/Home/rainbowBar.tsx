import React from 'react'
import { Box, Center, Link } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import styled from '@emotion/styled'
import { TrackEvent, useTrackClick } from 'hooks'
import { TESTING_URL } from '../../constants/env'

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
  const trackTesting = useTrackClick(TrackEvent.HomeClickTestingGo)
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
      <Box>
        {t('heading-banner-text.testing')}
        <Link
          fontWeight="bold"
          textDecoration="underline"
          display="inline-block"
          href={TESTING_URL}
          onClick={() => trackTesting()}
        >
          {t('go')}
        </Link>
      </Box>
    </RainbowBarContainer>
  )
}
