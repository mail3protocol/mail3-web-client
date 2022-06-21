import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'
import Script from 'next/script'
import App, { AppContext, AppProps } from 'next/app'
import { Provider as JotaiProvider } from 'jotai'
import { theme } from 'ui'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { useMemo } from 'react'
import { Cookies, CookiesProvider } from 'react-cookie'
import '../styles/globals.css'
import { GOOGLE_ANALYTICS_ID } from '../constants'

function Mail3({
  Component,
  pageProps,
  cookies,
}: AppProps & { cookies: Cookies }) {
  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta
          name="description"
          content="Mail3 is a crypto native communication protocol that promises security, privacy preservation and self-sovereign identity. It aims to be the infrastructure for web3 communication and the platform for valuable information such as relationships, reputation, and trust. "
        />
        <meta
          name="keywords"
          content="web3 mail, decentralized mail, blockchain mail, privacy, end-to-end encryption"
        />
        <title>
          Mail3: Build valuable connections in the decentralized society
        </title>

        <meta
          property="og:title"
          content="Mail3: Build valuable connections in the decentralized society"
        />
        <meta
          property="og:description"
          content="Mail3 is a crypto native communication protocol that promises security, privacy preservation and self-sovereign identity. It aims to be the infrastructure for web3 communication and the platform for valuable information such as relationships, reputation, and trust. "
        />
        <meta property="og:url" content="https://mail3.me" />
        <meta property="og:image" content="https://mail3.me/preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mail3dao" />
        <meta name="twitter:creator" content="@mail3dao" />
        <meta
          name="twitter:title"
          content="Mail3: Build valuable connections in the decentralized society"
        />
        <meta
          name="twitter:description"
          content="Mail3 is a crypto native communication protocol that promises security, privacy preservation and self-sovereign identity. It aims to be the infrastructure for web3 communication and the platform for valuable information such as relationships, reputation, and trust. "
        />
        <meta name="twitter:image:src" content="https://mail3.me/preview.png" />

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
      {GOOGLE_ANALYTICS_ID ? (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
      ) : null}
      {GOOGLE_ANALYTICS_ID ? (
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GOOGLE_ANALYTICS_ID}', { debug_mode: ${
            process.env.NODE_ENV !== 'production'
          } });
        `}
        </Script>
      ) : null}
      <CookiesProvider cookies={new Cookies(cookies)}>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <ChakraProvider theme={theme}>
              <Component {...pageProps} />
            </ChakraProvider>
          </JotaiProvider>
        </QueryClientProvider>
      </CookiesProvider>
    </>
  )
}

Mail3.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)
  return {
    ...appProps,
    cookies: appContext.ctx.req?.headers?.cookie,
  }
}

export default appWithTranslation(Mail3)
