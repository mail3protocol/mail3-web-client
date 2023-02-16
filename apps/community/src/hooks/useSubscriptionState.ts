import { useQuery } from 'react-query'
import { useAPI } from './useAPI'
import { SubscriptionResponse } from '../api/modals/SubscriptionResponse'
import { QueryKey } from '../api/QueryKey'

export function useSubscriptionState() {
  const api = useAPI()
  return useQuery<SubscriptionResponse>(
    [QueryKey.GetSubscriptionState],
    async () => api.getSubscription().then((r) => r.data)
  )
}
