import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

const { initConfig } = require('@joyid/evm')

initConfig({
  name: 'Mail3',
  logo: 'https://mail3.me/icons/icon-192x192.png',
  joyidAppURL: 'https://app.joy.id',
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
