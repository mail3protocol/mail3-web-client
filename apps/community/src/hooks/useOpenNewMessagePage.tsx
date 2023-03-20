import { useTranslation } from 'react-i18next'
import { TrackEvent, useTrackClick } from 'hooks'
import { MouseEventHandler } from 'react'
import { useQuery } from 'react-query'
import { useToast } from './useToast'
import { QueryKey } from '../api/QueryKey'
import { useAPI } from './useAPI'

export function useOpenNewMessagePage<T extends HTMLElement>() {
  const { t } = useTranslation('common')
  const toast = useToast()
  const trackClickNewMessage = useTrackClick(
    TrackEvent.CommunityClickNewMessage
  )

  const api = useAPI()
  const { data: quota = 0, isLoading } = useQuery(
    [QueryKey.CheckMessageQuote],
    () => api.checkMessageQuota().then((res) => res.data.quota)
  )

  const onClick: MouseEventHandler<T> = (e) => {
    trackClickNewMessage()
    if (isLoading) return
    if (quota <= 0) {
      e.stopPropagation()
      e.preventDefault()
      toast(t('send_time_limit'))
    }
  }
  return {
    onClick,
    isLoading,
  }
}
