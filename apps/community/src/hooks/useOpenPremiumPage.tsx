import { useDialog } from 'hooks'
import { useNavigate } from 'react-router-dom'
import { MouseEventHandler } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { SubscriptionState } from '../api/modals/SubscriptionResponse'
import { RoutePath } from '../route/path'
import { useSubscriptionState } from './useSubscriptionState'

export function useOpenPremiumPage() {
  const { t } = useTranslation('common')
  const { data, isLoading } = useSubscriptionState()
  const dialog = useDialog()
  const navi = useNavigate()
  const onClick: MouseEventHandler = (e) => {
    if (isLoading) {
      e.stopPropagation()
      e.preventDefault()
      return
    }
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
    }
  }
  return {
    onClick,
    isLoading,
  }
}
