/* eslint-disable prefer-regex-literals */
const withTM = require('next-transpile-modules')([
  'ui',
  'assets',
  'hooks',
  'shared',
  'connect-wallet',
  'models',
])

// const withImages = require('next-images')

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
  },
  async rewrites() {
    return [
      // Do not rewrite p routes
      {
        source: '/p/:any*',
        destination: '/p/:any*',
      },
      // Do not rewrite API routes
      {
        source: '/api/:any*',
        destination: '/api/:any*',
      },
      // Rewrite everything else to use `pages/index`
      {
        source:
          '/(messages|settings|setup|message/unread/developers/subscribe/subscription)(.*)',
        destination: '/',
      },
      {
        source: '/',
        destination: '/',
      },
      {
        source: '/:any*',
        destination: '/:any*',
      },
    ]
  },
  webpack(config, { isServer }) {
    const nextConfig = {
      inlineImageLimit: 8192,
      assetPrefix: '',
      basePath: '',
      fileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      ...config,
    }
    config.module.rules.push({
      test: new RegExp(`\\.(${nextConfig.fileExtensions.join('|')})$`),
      // Next.js already handles url() in css/sass/scss files
      issuer: new RegExp('\\.\\w+(?<!(s?c|sa)ss)$', 'i'),
      exclude: nextConfig.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: nextConfig.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            outputPath: `${isServer ? '../' : ''}static/images/`,
            ...{
              publicPath: `${
                nextConfig.assetPrefix || nextConfig.basePath || ''
              }/_next/static/images/`,
            },
            name: '[name]-[hash].[ext]',
            esModule: nextConfig.esModule || false,
          },
        },
      ],
    })

    const prefix = nextConfig.assetPrefix || ''
    const basePath = nextConfig.basePath || ''
    config.module.rules.push({
      test: /\.mp4$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            publicPath: `${prefix || basePath}/_next/static/videos/`,
            outputPath: `${isServer ? '../' : ''}static/videos/`,
          },
        },
      ],
    })

    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
      use: ['@svgr/webpack', 'url-loader'],
    })

    return config
  },
})
