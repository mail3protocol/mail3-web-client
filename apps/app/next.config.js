const withPWA = require('next-pwa')
const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(['ui', 'assets', 'hooks'])
const runtimeCaching = require('next-pwa/cache')
const { i18n } = require('./next-i18next.config')

const plugins = [withTM]

if (process.env.NODE_ENV === 'production') {
  plugins.push(withPWA)
}

/** @type {import('next').NextConfig} */
module.exports = withPlugins(plugins, {
  pwa: {
    dest: 'public',
    runtimeCaching,
  },
  i18n,
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
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
