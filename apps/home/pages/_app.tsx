import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'
import Script from 'next/script'
import type { AppProps } from 'next/app'
import { Provider as JotaiProvider } from 'jotai'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { useMemo } from 'react'
import { theme } from 'ui'
import '../styles/globals.css'
import { GOOGLE_ANALYTICS_ID } from '../constants/env'

function Mail3({ Component, pageProps }: AppProps) {
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
        <meta property="og:url" content="https://app.mail3.me" />
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
        <link
          href="/icons/icon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/icon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#fff" />
      </Head>
      {GOOGLE_ANALYTICS_ID ? (
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1PW4LM5ETS"
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
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </JotaiProvider>
      </QueryClientProvider>
    </>
  )
}

export default appWithTranslation(Mail3)
