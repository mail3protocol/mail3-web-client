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
      test: /\.svg$/i,
      type: 'asset',
      resourceQuery: /url/, // *.svg?url
    })

    config.module.rules.push({
      test: /\.svg$/,
      resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
      use: ['@svgr/webpack'],
    })

    return config
  },
  async redirects() {
    return [
      {
        source: '/settings',
        destination: '/settings/address',
        permanent: false,
      },
      {
        source: '/setup',
        destination: '/setup/address',
        permanent: false,
      },
    ]
  },
})
