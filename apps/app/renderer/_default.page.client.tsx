import ReactDOM from 'react-dom'
import type { PageContextClient } from './types'
import { Providers } from './Providers'

export async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext
  ReactDOM.render(
    <Providers>
      <Page {...pageProps} />
    </Providers>,
    document.getElementById('root')
  )
}

export const clientRouting = true
