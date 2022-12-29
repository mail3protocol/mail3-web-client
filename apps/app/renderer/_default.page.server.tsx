import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import type { PageContextServer } from './types'
import { Providers } from './Providers'

export async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext
  const pageHtml = renderToString(
    <Providers>
      <Page {...pageProps} />
    </Providers>
  )
  const { documentProps } = pageContext.exports
  const title =
    (documentProps && documentProps.title) ||
    'Mail3: Build valuable connections in the decentralized society'

  const documentHtml = escapeInject`<!DOCTYPE html>
<html>
  <head>
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
      ${title}
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
    <meta property="og:image" content="https://mail3.me/preview2.png" />
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
    <meta name="twitter:image:src" content="https://mail3.me/preview2.png" />

    <link rel="manifest" href="/manifest.json" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link
      href="/icons/icon-144x144.png"
      rel="icon"
      type="image/png"
      sizes="144x144"
    />
    <link rel="apple-touch-icon" href="/icons/icon-144x144.png" />
  </head>
  <body>
    <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
    <script>
      if (typeof global === 'undefined') {
        global = globalThis;
      }
    </script>
  </body>
</html>
`

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  }
}
