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

const Container = styled(Center)`
  height: calc(100vh - 60px);
  background-image: url(${landingBg});
  background-repeat: no-repeat;
  background-position: 50% calc(50% - 80px);
  background-size: 80%;

  @media (max-width: 600px) {
    background-size: 100%;
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
      <Center flexDirection="column" top="30px">
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
