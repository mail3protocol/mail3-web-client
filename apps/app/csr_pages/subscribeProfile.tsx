import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import { StaticRouter } from 'react-router-dom/server'
import Head from 'next/head'
import NextLink from 'next/link'
import { ConfirmDialog } from 'hooks'
import { NAVBAR_HEIGHT } from '../constants'
import {
  SubscribeProfileBody,
  SubscribeProfileDataProps,
} from '../components/SubscribeProfileBody'
import { RoutePath } from '../route/path'
import { App } from './app'

const SafeHydrate: React.FC = ({ children }) => (
  <div suppressHydrationWarning>
    {typeof window === 'undefined' ? null : children}
  </div>
)

const Navbar = () => (
  <Flex
    h={`${NAVBAR_HEIGHT}px`}
    alignItems="center"
    justifyContent={['flex-start', 'center', 'center']}
  >
    <NextLink href={RoutePath.Home} passHref>
      <a>
        <Logo textProps={{ color: '#231815' }} />
      </a>
    </NextLink>
  </Flex>
)

export const SubscribeProfile: React.FC<SubscribeProfileDataProps> = (
  props
) => {
  const { priAddress, userInfo, userSettings, uuid, address } = props
  const previewImage =
    userSettings.banner_url || 'https://mail3.me/preview2.png'
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content={userSettings.description} />
        <meta
          name="keywords"
          content="web3 mail, decentralized mail, blockchain mail, privacy, end-to-end encryption"
        />
        <title>{userInfo.nickname}</title>
        <meta property="og:title" content={userInfo.nickname} />
        <meta property="og:description" content={userSettings.description} />
        <meta property="og:image" content={previewImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mail3dao" />
        <meta name="twitter:creator" content="@mail3dao" />
        <meta name="twitter:title" content={userInfo.nickname} />
        <meta name="twitter:description" content={userSettings.description} />
        <meta name="twitter:image" content={previewImage} />

        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          href="/icons/icon-144x144.png"
          rel="icon"
          type="image/png"
          sizes="144x144"
        />
        <link rel="apple-touch-icon" href="/icons/icon-144x144.png" />
      </Head>
      <SafeHydrate>
        <App>
          <StaticRouter location="/:id">
            <PageContainer>
              <Navbar />
            </PageContainer>
            <SubscribeProfileBody
              uuid={uuid}
              address={address}
              priAddress={priAddress}
              userInfo={props.userInfo}
              userSettings={props.userSettings}
            />
            <ConfirmDialog />
          </StaticRouter>
        </App>
      </SafeHydrate>
    </>
  )
}
