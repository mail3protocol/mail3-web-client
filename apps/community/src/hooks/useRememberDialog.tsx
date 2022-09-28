import { useDialog } from 'hooks'
import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { AuthContent } from '../components/Auth'

export function useRememberDialog() {
  const dialog = useDialog()
  const { t } = useTranslation(['hooks', 'common'])
  return useCallback(
    () =>
      dialog({
        title: t('connect_wallet', { ns: 'common' }),
        description: <AuthContent />,
        modalProps: {
          size: 'sm',
        },
      }),
    [t, dialog]
  )
}
