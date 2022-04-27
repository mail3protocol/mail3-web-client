import React from 'react'
import { Center, Heading, Text } from '@chakra-ui/react'
import Logo from 'assets/svg/logo-big.svg'
import Image from 'next/image'
import landingBg from 'assets/svg/landing-bg.svg?url'
import { useTranslation } from 'next-i18next'
import { Button } from 'ui'
import { useConnectWalletDialog } from 'hooks'
import styled from '@emotion/styled'
import landingCat from '../../assets/landing-cat.png'
import { NAVBAR_GUTTER, NAVBAR_HEIGHT } from '../../constants'

const Container = styled(Center)`
  height: calc(100vh - ${NAVBAR_GUTTER + NAVBAR_HEIGHT}px);
  background-image: url(${landingBg});
  background-repeat: no-repeat;
  background-position: 50% calc(50% - 100px);
  background-size: 80%;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  margin-top: ${NAVBAR_GUTTER}px;

  @media (max-width: 600px) {
    background-size: 100%;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: none;
  }

  .footer {
    position: absolute;
    bottom: 0;
  }
`

export const LandingPage = () => {
  const [t] = useTranslation('home')
  const { onOpen } = useConnectWalletDialog()
  return (
    <Container position="relative" textAlign="center">
      <Center
        flexDirection="column"
        position="relative"
        top={`-${(NAVBAR_GUTTER + NAVBAR_HEIGHT) / 2}px`}
      >
        <Logo />
        <Heading mt="44px" mb="8px">
          {t('title')}
        </Heading>
        <Text mb="40px">{t('desc')}</Text>
        <Button onClick={onOpen}>{t('connect')}</Button>
      </Center>
      <footer className="footer">
        <Image
          src={landingCat}
          width="118px"
          height="130px"
          alt="landing-cat"
        />
      </footer>
    </Container>
  )
}
