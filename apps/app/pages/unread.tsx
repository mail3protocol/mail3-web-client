import { useDidMount, useLoginInfo } from 'hooks'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { API } from '../api'

export const UnReadPage = () => {
  const [searchParams] = useSearchParams()
  const fromAddress = searchParams.get('from')
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
      const { data } = await api.getMessagesNew(0)
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
  // return (
  //   <Head>
  //     <title>Mail3: Mail Me Button</title>
  //   </Head>
  // )
}
