import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
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
  useQuery(
    ['newsQuery'],
    async () => {
      const { data } = await api.getMessagesNew(0)
      return data.total
    },
    {
      onSuccess(total) {
        window.parent.postMessage({ total })
      },
      onError() {
        window.parent.postMessage({ total: -2 })
      },
    }
  )
  return null
}

export default UnRead
