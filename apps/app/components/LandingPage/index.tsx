import React from 'react'
import { Center, Flex, Heading, Text } from '@chakra-ui/react'
import Image from 'next/image'
import landingBg from 'assets/svg/landing-bg.svg?url'
import { useTranslation } from 'next-i18next'
import { Button, LogoAnimation } from 'ui'
import { useConnectWalletDialog } from 'hooks'
import styled from '@emotion/styled'
import landingCat from '../../assets/landing-cat.png'
import { NAVBAR_GUTTER, NAVBAR_HEIGHT } from '../../constants'

const Container = styled(Center)`
  min-height: calc(100vh - ${NAVBAR_GUTTER + NAVBAR_HEIGHT}px);
  background-image: url(${landingBg});
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 80%;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  margin-top: ${NAVBAR_GUTTER}px;
  flex-direction: column;
  /* align-items: center;
  justify-content: center; */

  @media (max-width: 600px) {
    background-size: 100%;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: none;
  }

  .footer {
    position: absolute;
    bottom: 0;

    @media (max-height: 650px) {
      margin-top: 16px;
      position: static;
    }
  }
`

export const LandingPage = () => {
  const [t] = useTranslation('home')
  const { onOpen } = useConnectWalletDialog()
  return (
    <Container position="relative" textAlign="center">
      <Center flexDirection="column" maxW="100%">
        <LogoAnimation w="432px" />
        <Heading mt="16px" mb="8px">
          {t('title')}
        </Heading>
        <Text mb="40px">{t('desc')}</Text>
        <Button onClick={onOpen}>{t('connect')}</Button>
      </Center>
      <Flex className="footer">
        <Image
          src={landingCat}
          width="118px"
          height="130px"
          alt="landing-cat"
        />
      </Flex>
    </Container>
  )
}
