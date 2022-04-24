const withTM = require('next-transpile-modules')(['ui', 'assets', 'hooks'])
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
module.exports = withTM({
  i18n,
  reactStrictMode: true,
})
