import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { App } from './app'
import '../styles/globals.css'
import { SENTRY_DSN } from '../constants'

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0,
  })
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
