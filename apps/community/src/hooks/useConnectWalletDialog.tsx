import { useDialog } from 'hooks'
import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { SelectConnectWallet } from '../components/SelectConnectWallet'

export function useConnectWalletDialog() {
  const dialog = useDialog()
  const { t } = useTranslation(['hooks', 'common'])
  return useCallback(
    () =>
      dialog({
        title: t('connect_wallet', { ns: 'common' }),
        description: <SelectConnectWallet />,
      }),
    [t, dialog]
  )
}
