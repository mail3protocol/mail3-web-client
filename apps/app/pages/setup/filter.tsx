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

  .h2 {
    font-weight: 700;
    font-size: 16px;
    span {
      background: radial-gradient(
        100% 100% at 80% 50%,
        #de1af075 0%,
        rgba(46, 255, 205, 1) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .content {
    width: 476px;
    background: rgba(244, 251, 241, 0.5);
    border-radius: 20px;
    text-align: center;
  }

  .button-item {
    width: 270px;
    border: none;

    padding: 2px;
    border-radius: 46px;

    background: linear-gradient(
      90.02deg,
      #ffb1b1 0.01%,
      #ffcd4b 50.26%,
      #916bff 99.99%
    );
    .button-item-bg {
      background-color: #fff;
      color: #000;
      font-weight: 700;
      font-size: 16px;
      border-radius: 46px;
      height: 100%;
      width: 100%;

      div {
        background: linear-gradient(
          90.02deg,
          #ffb1b1 0.01%,
          #ffcd4b 50.26%,
          #916bff 99.99%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }

  @media (max-width: 600px) {
    .content {
      width: 345px;
    }
    .h2 {
      font-size: 14px;
    }
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
            <Heading fontSize={{ base: '20px', md: '28px' }}>
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

          <Container
            justifyContent="center"
            direction="column"
            alignItems="center"
          >
            <Box className="h2">With Mail3, you control who can reach you.</Box>
            <Box
              maxW="600px"
              textAlign="center"
              lineHeight="20px"
              fontSize={{ base: '12px', md: '16px' }}
              m={{ base: '0 0 20px 0', md: '8px 0 20px 0' }}
            >
              Before someone land an email in your inbox, <br /> you can decide
              if you want to receive emails from them or not.
            </Box>
            <Flex
              className="content"
              direction="column"
              align="center"
              p="20px 0"
            >
              <Box className="h2">
                Use <span>Web3 DID</span> to filter senders automaticly
              </Box>
              <Box m="10px">Get emails from who...</Box>
              <Box className="button-item ens">
                <Center className="button-item-bg">
                  <Box w="100%">HOLD ENS</Box>
                </Center>
              </Box>
              <Box m="10px">or</Box>
              <Box className="button-item eth">
                <Center className="button-item-bg">
                  <Box w="100%">HOLD at least 0.01 ETH</Box>
                </Center>
              </Box>
              <Box>or</Box>
              <Link href={RoutePath.Inbox} passHref>
                <Button
                  w="270px"
                  mt="20px"
                  bg="black"
                  color="white"
                  h="40px"
                  onClick={() => trackNext()}
                  _hover={{
                    bg: 'brand.50',
                  }}
                  as="a"
                  rightIcon={<ChevronRightIcon color="white" />}
                >
                  <Center flexDirection="column">
                    <Text>Set up</Text>
                  </Center>
                </Button>
              </Link>
            </Flex>
          </Container>

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
