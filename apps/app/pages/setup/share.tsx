import React, { useMemo, useRef } from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, PageContainer } from 'ui'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { TrackEvent, useScreenshot, useTrackClick } from 'hooks'
import {
  Box,
  Center,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Head from 'next/head'
import styled from '@emotion/styled'
import { useAtomValue } from 'jotai/utils'
import { shareToTwitter } from 'shared'
import { Navbar } from '../../components/Navbar'
import { RoutePath } from '../../route/path'
import { SettingContainer } from '../../components/Settings/SettingContainer'
import { getAuthenticateProps, userPropertiesAtom } from '../../hooks/useLogin'

import SvgCopy from '../../assets/profile/copy.svg'
import SvgShare from '../../assets/profile/share.svg'
import SvgTwitter from '../../assets/profile/twitter-blue.svg'
import { ShareCard } from '../../components/Profile/card'

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

const SetupShare: NextPage = () => {
  const [t] = useTranslation('settings')
  const trackNext = useTrackClick(TrackEvent.ClickSignatureNext)
  const cardRef = useRef<HTMLDivElement>(null)
  const { downloadScreenshot } = useScreenshot()
  const userProps = useAtomValue(userPropertiesAtom)

  const mailAddress = useMemo(
    () => userProps?.defaultAddress ?? 'unknown',
    [userProps]
  )

  const onShareTwitter = () => {
    shareToTwitter({
      text: 'Hey, contact me using my Mail3 email address.',
      url: `https://mail3.me/${mailAddress}`,
      hashtags: ['mail3', 'mail3dao'],
    })
  }

  const onSharePic = () => {
    if (!cardRef?.current) return
    downloadScreenshot(cardRef.current, 'share.png')
  }

  return (
    <>
      <Head>
        <title>Mail3: Share</title>
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
              {t('setup.share.title')}
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
          <Container justifyContent="center">
            <Box w="600px">
              <Flex
                width="100%"
                p="11px 16px"
                color="#000"
                border="1px solid #E7E7E7"
                borderRadius="8px"
                justify="space-between"
              >
                <Text fontSize="14px" wordBreak="break-all">
                  0x50D96aD72c7abF7fCfBEFDE24ddC33BeEeb08c43@mail3.me
                </Text>
                <Spacer />
                <Flex
                  as="button"
                  fontSize={{ base: 0, md: '12px' }}
                  alignItems="center"
                >
                  <SvgCopy />
                  <Box ml="5px">Copy</Box>
                </Flex>
              </Flex>
              <Stack
                align="center"
                justify="center"
                mt="24px"
                direction={{ base: 'column-reverse', md: 'row' }}
                spacing="20px"
              >
                <Box w="228px" h="343px">
                  <Box transform={`scale(${228 / 375})`} transformOrigin="0 0">
                    <ShareCard
                      mailAddress="0x50D96aD72c7abF7fCfBEFDE24ddC33BeEeb08c43@mail3.me"
                      isPic
                    />
                  </Box>
                </Box>
                <VStack w="207px" spacing="20px">
                  <Flex
                    as="button"
                    onClick={onShareTwitter}
                    className="button-item twitter"
                  >
                    <SvgTwitter />
                    <Box ml="5px">{t('setup.share.twitter')}</Box>
                  </Flex>
                  <Flex
                    as="button"
                    onClick={onSharePic}
                    className="button-item"
                  >
                    <SvgShare /> <Box ml="5px">{t('setup.share.card')}</Box>
                  </Flex>
                </VStack>
              </Stack>
            </Box>
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

      <ShareCard
        ref={cardRef}
        mailAddress="0x50D96aD72c7abF7fCfBEFDE24ddC33BeEeb08c43@mail3.me"
      />
    </>
  )
}

export default SetupShare
