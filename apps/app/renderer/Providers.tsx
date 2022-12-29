import React, { ReactNode, StrictMode, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { I18nextProvider } from 'react-i18next'
import { Provider as JotaiProvider } from 'jotai'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from 'ui'
import i18n from '../i18n'
import '../styles/globals.css'

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), [])
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <JotaiProvider>
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
          </JotaiProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
