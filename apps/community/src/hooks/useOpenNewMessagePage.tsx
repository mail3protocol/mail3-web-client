import { Trans, useTranslation } from 'react-i18next'
import { TrackEvent, useDialog, useTrackClick } from 'hooks'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Dayjs } from 'dayjs'
import { isNextDay } from 'shared/src/isNextDay'
import { MouseEventHandler } from 'react'
import { useToast } from './useToast'
import { useAPI } from './useAPI'
import {
  SubscriptionResponse,
  SubscriptionState,
} from '../api/modals/SubscriptionResponse'
import { QueryKey } from '../api/QueryKey'
import { RoutePath } from '../route/path'

export interface UseNewMessagePageProps {
  lastMessageSentTime?: Dayjs
  isLoading?: boolean
}

export function useOpenNewMessagePage<T extends HTMLElement>({
  lastMessageSentTime,
  isLoading,
}: UseNewMessagePageProps) {
  const { t } = useTranslation('common')
  const toast = useToast()
  const trackClickNewMessage = useTrackClick(
    TrackEvent.CommunityClickNewMessage
  )
  const api = useAPI()
  const { data, isLoading: isLoadingSubscriptionState } =
    useQuery<SubscriptionResponse>([QueryKey.GetSubscriptionState], async () =>
      api.getSubscription().then((r) => r.data)
    )
  const dialog = useDialog()
  const navi = useNavigate()
  const currentIsLoading = isLoading || isLoadingSubscriptionState
  const onClick: MouseEventHandler<T> = (e) => {
    trackClickNewMessage()
    if (currentIsLoading) return
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
    if (lastMessageSentTime && !isNextDay(lastMessageSentTime)) {
      e.stopPropagation()
      e.preventDefault()
      toast(t('send_time_limit'))
    }
  }
  return {
    onClick,
    isLoading: currentIsLoading,
  }
}
