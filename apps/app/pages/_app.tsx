import { AppProps } from 'next/app'
// import { initConfig } from '@joyid/evm'
import Script from 'next/script'
import { GOOGLE_ANALYTICS_ID } from '../constants'
import '../styles/globals.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/300.css'

const { initConfig } = require('@joyid/evm')

initConfig({
  name: 'Mail3',
  logo: 'https://mail3.me/icons/icon-192x192.png',
  joyidAppURL: 'https://app.joy.id',
})

function App({ Component, pageProps }: AppProps) {
  return (
    <>
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
      <Component {...pageProps} />
    </>
  )
}

export default App
