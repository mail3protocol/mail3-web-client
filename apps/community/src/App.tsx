import React, { useMemo } from 'react'
import { Provider as JotaiProvider } from 'jotai'
import { CommunityTheme } from 'ui'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { Routers } from './route'

const App: React.FC = () => {
  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <JotaiProvider>
          <ChakraProvider theme={CommunityTheme}>
            <Routers />
          </ChakraProvider>
        </JotaiProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default App
