const withPWA = require('next-pwa')
const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(['ui'])
const runtimeCaching = require('next-pwa/cache')
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
module.exports = withPlugins([withTM, withPWA], {
  pwa: {
    dest: 'public',
    runtimeCaching,
  },
  i18n,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/inbox',
        has: [
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        permanent: true,
      },
    ]
  },
})
