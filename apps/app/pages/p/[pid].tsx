import ErrorPage from 'next/error'
import { isPrimitiveEthAddress } from 'shared'
import { StaticRouter } from 'react-router-dom/server'
import { GetStaticPropsContext } from 'next'
import { parse } from 'node-html-parser'
import Head from 'next/head'
import { API } from '../../api'
import {
  SubscriptionArticle,
  SubscriptionArticleProps,
} from '../../csr_pages/subscriptionArticle'
import { App } from '../../csr_pages/app'
import { RoutePath } from '../../route/path'
import { APP_URL } from '../../constants'
import { SafeHydrate } from '../../components/SafeHydrate'

const getPreviewImage = (content: string) => {
  let previewImage = `${APP_URL}/images/preview-article.png`
  try {
    const root = parse(content)
    const imgs = root.querySelectorAll('img')
    if (imgs) {
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i]
        const src = img.getAttribute('src')
        if (src && /\.(jpg|png|gif|webp)$/i.test(src)) {
          previewImage = src
          break
        }
      }
    }
  } catch (error) {
    //
  }

  return previewImage
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const pid = params?.pid
  if (typeof pid !== 'string') {
    return {
      props: {
        errorCode: 404,
      },
    }
  }

  const api = new API()
  try {
    const messageDetail = await api.SubscriptionMessageDetail(pid)
    if (messageDetail.status !== 200) {
      return {
        props: {
          errorCode: messageDetail.status,
        },
      }
    }

    const address = messageDetail?.data?.writer_name || ''
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
          errorCode: messageDetail.status,
        },
      }
    }

    const userInfo = await Promise.all([
      api.getSubscribeUserInfo(priAddress),
      api.getUserSetting(priAddress),
    ]).then((res) => ({
      ...res[0].data,
      ...res[1].data,
    }))

    const previewImage = getPreviewImage(messageDetail.data.content)

    return {
      props: {
        priAddress,
        detail: messageDetail.data,
        articleId: pid,
        uuid,
        userInfo,
        previewImage,
      },
      revalidate: 60 * 60 * 24 * 7, // 7 days
    }
  } catch (error) {
    return {
      props: {
        errorCode: 500,
      },
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default function SubscriptionArticlePage(
  props: SubscriptionArticleProps
) {
  if (props.errorCode) {
    return <ErrorPage statusCode={props.errorCode} />
  }

  const description = props.detail.summary
  const title = props.detail.subject
  const articleUrl = `${APP_URL}/p/${props.uuid}`

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="web3 mail, decentralized mail, blockchain mail, privacy, end-to-end encryption"
        />
        <title>{title}</title>
        <meta property="author" content={props?.userInfo?.nickname} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:image" content={props.previewImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mail3dao" />
        <meta name="twitter:creator" content="@mail3dao" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={props.previewImage} />

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
      <SafeHydrate>
        <App>
          <StaticRouter
            location={`${RoutePath.SubscriptionArticle}/${props.articleId}`}
          >
            <SubscriptionArticle {...props} />
          </StaticRouter>
        </App>
      </SafeHydrate>
    </>
  )
}
