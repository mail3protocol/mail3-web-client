import React, { useMemo, useRef } from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, PageContainer, ProfileCard } from 'ui'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { TrackEvent, useScreenshot, useToast, useTrackClick } from 'hooks'
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
import SvgCopy from 'assets/profile/copy.svg'
import SvgShare from 'assets/profile/share.svg'
import SvgTwitter from 'assets/profile/twitter-blue.svg'
import SvgEtherscan from 'assets/profile/business/etherscan.svg'
import SvgArrow from 'assets/profile/business/arrow.svg'
import { Navbar } from '../../components/Navbar'
import { RoutePath } from '../../route/path'
import { SettingContainer } from '../../components/Settings/SettingContainer'
import { getAuthenticateProps, userPropertiesAtom } from '../../hooks/useLogin'

import { copyText } from '../../utils'

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
  const [t2] = useTranslation('common')
  const toast = useToast()
  const trackNext = useTrackClick(TrackEvent.ClickShareYourNext)
  const trackCopy = useTrackClick(TrackEvent.ClickGuideCopy)
  const trackTwitter = useTrackClick(TrackEvent.ClickGuideTwitter)
  const trackDownload = useTrackClick(TrackEvent.ClickGuideDownloadCard)
  const { downloadScreenshot } = useScreenshot()

  const userProps = useAtomValue(userPropertiesAtom)

  const cardRef = useRef<HTMLDivElement>(null)

  const mailAddress: string = useMemo(
    () => userProps?.defaultAddress ?? 'unknown',
    [userProps]
  )

  const profileUrl: string = useMemo(() => {
    const ads = mailAddress.substring(0, mailAddress.indexOf('@'))
    return `https://mail3.me/${ads}`
  }, [mailAddress])

  const onShareTwitter = () => {
    trackTwitter()
    shareToTwitter({
      text: 'Hey, contact me using my Mail3 email address.',
      url: profileUrl,
      hashtags: ['mail3', 'mail3dao'],
    })
  }

  const onSharePic = () => {
    trackDownload()
    if (!cardRef?.current) return
    downloadScreenshot(cardRef.current, 'share.png')
  }

  const onCopy = async () => {
    trackCopy()
    await copyText(profileUrl)
    toast(t2('navbar.copied'))
  }

  const Icons = [SvgArrow, SvgEtherscan].map((Item, index) => (
    <Box
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      w="24px"
      h="24px"
    >
      <Item />
    </Box>
  ))

  return (
    <>
      <Head>
        <title>Mail3: Setup Share Profile</title>
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
                  {profileUrl}
                </Text>
                <Spacer />
                <Flex
                  as="button"
                  fontSize={{ base: 0, md: '12px' }}
                  alignItems="center"
                  onClick={onCopy}
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
                    <ProfileCard mailAddress={mailAddress} isPic>
                      {Icons}
                    </ProfileCard>
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

      <ProfileCard ref={cardRef} mailAddress={mailAddress}>
        {Icons}
      </ProfileCard>
    </>
  )
}

export default SetupShare
