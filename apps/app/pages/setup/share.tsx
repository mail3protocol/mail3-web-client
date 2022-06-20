import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, PageContainer } from 'ui'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { TrackEvent, useTrackClick } from 'hooks'
import { Box, Center, Flex, Heading, Spacer, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Head from 'next/head'
import { Navbar } from '../../components/Navbar'
import { RoutePath } from '../../route/path'
import { SettingContainer } from '../../components/Settings/SettingContainer'
import { getAuthenticateProps } from '../../hooks/useLogin'

import SvgCopy from '../../assets/profile/copy.svg'

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

const SetupShare: NextPage = () => {
  const [t] = useTranslation('settings')
  const trackNext = useTrackClick(TrackEvent.ClickSignatureNext)
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
          <Flex justifyContent="center">
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
            </Box>
          </Flex>
        </SettingContainer>
      </PageContainer>
    </>
  )
}

export default SetupShare
