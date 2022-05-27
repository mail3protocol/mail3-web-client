const withTM = require('next-transpile-modules')(['ui', 'assets', 'hooks'])
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
module.exports = withTM({
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
})
