import { Trans, useTranslation } from 'react-i18next'
import { TrackEvent, useDialog, useTrackClick } from 'hooks'
import { useNavigate } from 'react-router-dom'
import { MouseEventHandler } from 'react'
import { useQuery } from 'react-query'
import { useToast } from './useToast'
import { SubscriptionState } from '../api/modals/SubscriptionResponse'
import { RoutePath } from '../route/path'
import { useSubscriptionState } from './useSubscriptionState'
import { QueryKey } from '../api/QueryKey'
import { useAPI } from './useAPI'

export function useOpenNewMessagePage<T extends HTMLElement>() {
  const { t } = useTranslation('common')
  const toast = useToast()
  const trackClickNewMessage = useTrackClick(
    TrackEvent.CommunityClickNewMessage
  )
  const { data, isLoading: isLoadingSubscriptionState } = useSubscriptionState()
  const dialog = useDialog()
  const navi = useNavigate()
  const api = useAPI()
  const { data: quota = 0, isLoading } = useQuery(
    [QueryKey.CheckMessageQuote],
    () => api.checkMessageQuota().then((res) => res.data.quota)
  )

  const onClick: MouseEventHandler<T> = (e) => {
    trackClickNewMessage()
    if (isLoading) return
    if (data?.state !== SubscriptionState.Active) {
      e.stopPropagation()
      e.preventDefault()
      dialog({
        title: t('need_open_earn_nft_dialog.title'),
        description: (
          <Trans
            t={t}
            i18nKey="need_open_earn_nft_dialog.description"
            components={{ b: <b /> }}
          />
        ),
        okText: t('need_open_earn_nft_dialog.confirm'),
        onConfirm() {
          navi(RoutePath.EarnNft)
        },
      })
      return
    }
    if (quota <= 0) {
      e.stopPropagation()
      e.preventDefault()
      toast(t('send_time_limit'))
    }
  }
  return {
    onClick,
    isLoading: isLoading || isLoadingSubscriptionState,
  }
}
