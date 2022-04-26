const withTM = require('next-transpile-modules')(['ui'])
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
module.exports = withTM({
  i18n,
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
})
