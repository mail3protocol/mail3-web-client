import ErrorPage from 'next/error'
import { isPrimitiveEthAddress } from 'shared'
import { StaticRouter } from 'react-router-dom/server'
import { GetStaticPropsContext } from 'next'
import { API } from '../../api'
import {
  SubscriptionArticle,
  SubscriptionArticleProps,
} from '../../csr_pages/subscriptionArticle'
import { App } from '../../csr_pages/app'
import { RoutePath } from '../../route/path'

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

    return {
      props: {
        priAddress,
        detail: messageDetail.data,
        articleId: pid,
        uuid,
      },
      revalidate: 60 * 60 * 1, // 1 hours
    }
  } catch (error) {
    return {
      props: {
        errorCode: 404,
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

  return (
    <App>
      <StaticRouter
        location={`${RoutePath.SubscriptionArticle}/${props.articleId}`}
      >
        <SubscriptionArticle {...props} />
      </StaticRouter>
    </App>
  )
}
