import { useDidMount } from 'hooks'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { API } from '../api'
import { useLoginInfo } from '../hooks/useLoginInfo'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['common'])),
  },
})

const UnRead: NextPage = () => {
  const router = useRouter()
  const fromAddress = router.query.from
  const loginInfo = useLoginInfo()
  useDidMount(() => {
    if (loginInfo == null) {
      window.parent.postMessage({ target: 'mail3-check-mail', total: -2 }, '*')
    }
  })
  useQuery(
    ['unread', fromAddress, loginInfo],
    async () => {
      const api = new API(loginInfo?.address, loginInfo?.jwt)
      if (typeof fromAddress === 'string') {
        const { data } = await api.getUnreadMessagesCount(fromAddress)
        return data.total
      }
      const { data } = await api.getMessagesSeen(0)
      return data.total
    },
    {
      enabled: loginInfo != null,
      onSuccess(total) {
        window.parent.postMessage({ target: 'mail3-check-mail', total }, '*')
      },
      onError() {
        window.parent.postMessage(
          { target: 'mail3-check-mail', total: -2 },
          '*'
        )
      },
    }
  )
  return null
}

export default UnRead
