import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, PageContainer } from 'ui'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { TrackEvent, useTrackClick } from 'hooks'
import { Box, Center, Flex, Heading, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Head from 'next/head'
import styled from '@emotion/styled'
import { Navbar } from '../../components/Navbar'
import { RoutePath } from '../../route/path'
import { SettingContainer } from '../../components/Settings/SettingContainer'
import { getAuthenticateProps } from '../../hooks/useLogin'

export const getServerSideProps: GetServerSideProps = getAuthenticateProps(
  async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale as string, [
        'settings',
        'common',
      ])),
    },
  })
)

const Container = styled(Flex)`
  .button-item {
    width: 207px;
    height: 43px;
    background: #ffffff;
    border: 1px solid #000000;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 700;
    align-items: center;
    justify-content: center;
  }
  .button-item.twitter {
    color: #ffffff;
    border: none;
    background: linear-gradient(
      90.02deg,
      #ffb1b1 0.01%,
      #ffcd4b 50.26%,
      #916bff 99.99%
    );
  }
`

const Footer = styled(Box)`
  justify-content: center;
  display: none;
  @media (max-width: 930px) {
    display: flex;
    margin-top: 20px;
  }
`

const SetupFilter: NextPage = () => {
  const [t] = useTranslation('settings')
  const trackNext = useTrackClick(TrackEvent.ClickShareYourNext)

  return (
    <>
      <Head>
        <title>Mail3: Filter Spam Based On Web3 DID</title>
      </Head>
      <PageContainer>
        <Navbar />
        <SettingContainer>
          <Center
            position="relative"
            w="100%"
            mb="20px"
            mt={['20px', '20px', '40px']}
          >
            <Heading fontSize={['20px', '20px', '28px']}>
              Filter Spam Based On Web3 DID
            </Heading>
            <Link href={RoutePath.Inbox} passHref>
              <Button
                bg="black"
                color="white"
                className="next-header"
                position="absolute"
                right="60px"
                onClick={() => trackNext()}
                _hover={{
                  bg: 'brand.50',
                }}
                as="a"
                rightIcon={<ChevronRightIcon color="white" />}
              >
                <Center flexDirection="column">
                  <Text>{t('setup.next')}</Text>
                </Center>
              </Button>
            </Link>
          </Center>
          <Container justifyContent="center">did filter</Container>

          <Footer>
            <Link href={RoutePath.Inbox} passHref>
              <Button
                bg="black"
                color="white"
                w="250px"
                h="50px"
                onClick={() => trackNext()}
                _hover={{
                  bg: 'brand.50',
                }}
                as="a"
                rightIcon={<ChevronRightIcon color="white" />}
              >
                <Center flexDirection="column">
                  <Text>{t('setup.next')}</Text>
                </Center>
              </Button>
            </Link>
          </Footer>
        </SettingContainer>
      </PageContainer>
    </>
  )
}

export default SetupFilter
