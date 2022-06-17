import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { useAPI } from '../hooks/useAPI'
import { getAuthenticateProps } from '../hooks/useLogin'

export const getServerSideProps: GetServerSideProps = getAuthenticateProps(
  async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  })
)

const UnRead: NextPage = () => {
  const api = useAPI()
  const router = useRouter()
  useQuery(
    ['unread', router.query.from],
    async () => {
      const { data } = await api.getUnreadMessagesCount(
        router.query.from as string
      )
      return data.total
    },
    {
      onSuccess(total) {
        window.parent.postMessage({ target: 'mail3-unread', total })
      },
      onError() {
        window.parent.postMessage({ target: 'mail3-unread', total: -2 })
      },
    }
  )
  return null
}

export default UnRead
