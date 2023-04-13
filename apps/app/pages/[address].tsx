import ErrorPage from 'next/error'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import React, { useMemo } from 'react'
import { StaticRouter } from 'react-router-dom/server'
import axios from 'axios'
import Head from 'next/head'
import {
  isEthAddress,
  isPrimitiveEthAddress,
  isSupportedAddress,
  truncateMiddle,
} from 'shared'
import { SubscribeProfileDataProps } from '../components/SubscribeProfileBody'
import { SubscribeProfile } from '../csr_pages/subscribeProfile'
import { App } from '../csr_pages/app'
import { API } from '../api'
import { getLogger, LoggerLevel } from '../logger'

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> => {
  const address = params?.address
  const logger = getLogger(LoggerLevel.Profile)
  const revalidate = 60 * 5 // 5 mins
  if (typeof address !== 'string') {
    return {
      props: {
        statusCode: 200,
      },
    }
  }
  if (isSupportedAddress(address)) {
    const api = new API()
    try {
      const priAddress = isPrimitiveEthAddress(address)
        ? address
        : await api
            .getPrimitiveAddress(address)
            .then((r) => (r.status === 200 ? r.data.eth_address : ''))

      const uuid =
        (await api
          .checkIsProject(address)
          .then((r) => (r.status === 200 ? r.data.uuid : ''))) || ''

      if (!priAddress || !uuid) {
        return {
          props: {
            statusCode: 404,
          },
          revalidate,
        }
      }
      const [
        { data: userInfo, status: userInfoStatus },
        { data: userSettings, status: userSettingsStatus },
      ] = await Promise.all([
        api.getSubscribeUserInfo(priAddress),
        api.getUserSetting(priAddress),
      ])

      if (userInfoStatus !== 200) {
        return {
          props: {
            statusCode: userInfoStatus,
          },
          revalidate,
        }
      }

      if (userSettingsStatus !== 200) {
        return {
          props: {
            statusCode: userSettingsStatus,
          },
          revalidate,
        }
      }

      return {
        props: {
          statusCode: 200,
          data: {
            userInfo,
            userSettings,
            priAddress,
            uuid,
            address,
          },
        },
        revalidate,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(error)
        return {
          props: {
            statusCode: error.response?.status || 500,
          },
          revalidate,
        }
      }

      return {
        props: {
          statusCode: 500,
        },
        revalidate,
      }
    }
  }
  return {
    props: {
      statusCode: 404,
    },
    notFound: true,
  }
}

export async function getStaticPaths() {
  return {
    paths: ['/mail3.eth'],
    fallback: 'blocking',
  }
}

interface Props {
  statusCode: number
  data?: SubscribeProfileDataProps
}

export default function SubscribeProfilePage(props: Props) {
  const { statusCode, data } = props
  const userInfo = data?.userInfo
  const userSettings = data?.userSettings
  const address = data?.address || ''
  const previewImage = userSettings?.banner_url || '/profile-preview.png'

  const nickname = useMemo(() => {
    if (userInfo?.nickname) {
      return userInfo.nickname
    }
    if (isPrimitiveEthAddress(address)) {
      return truncateMiddle(address, 6, 4, '_')
    }
    if (isEthAddress(address)) {
      return address.includes('.') ? address.split('.')[0] : address
    }
    return ''
  }, [userInfo])

  if (statusCode !== 200 || !data) {
    return <ErrorPage statusCode={statusCode} />
  }
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content={userSettings?.description} />
        <meta
          name="keywords"
          content="web3 mail, decentralized mail, blockchain mail, privacy, end-to-end encryption"
        />
        <title>Mail3: Subscription Page</title>
        <meta property="og:title" content={nickname} />
        <meta property="og:description" content={userSettings?.description} />
        <meta property="og:image" content={previewImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mail3dao" />
        <meta name="twitter:creator" content="@mail3dao" />
        <meta name="twitter:title" content={nickname} />
        <meta name="twitter:description" content={userSettings?.description} />
        <meta name="twitter:image" content={previewImage} />

        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          href="/icons/icon-144x144.png"
          rel="icon"
          type="image/png"
          sizes="144x144"
        />
        <link rel="apple-touch-icon" href="/icons/icon-144x144.png" />
      </Head>
      <App>
        <StaticRouter location="/:id">
          <SubscribeProfile {...data} />
        </StaticRouter>
      </App>
    </>
  )
}
