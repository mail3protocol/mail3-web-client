import { useNavigate, useLocation, createSearchParams } from 'react-router-dom'
import { atomWithReset, useResetAtom } from 'jotai/utils'
import { useAtom } from 'jotai'
import { useAPI } from '../../../hooks/useAPI'
import { useSubject } from './useSubject'
import { useAttachment } from './useAttachment'
import { ID_NAME, removeDraft } from './useSubmitMessage'

const savingMessageAtom = atomWithReset(false)

export function useSaveMessage() {
  const api = useAPI()
  const { subject, toAddresses, fromAddress, ccAddresses, bccAddresses } =
    useSubject()
  const navi = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useAtom(savingMessageAtom)
  const onResetSavingAtom = useResetAtom(savingMessageAtom)
  const { attachments } = useAttachment()
  const onSave = async (html: string) => {
    if (!fromAddress || isLoading) return
    setIsLoading(true)
    try {
      const res = await api.uploadMessage({
        path: 'Drafts',
        from: {
          address: fromAddress,
        },
        subject,
        to: toAddresses.map((address) => ({ address })),
        cc: ccAddresses.map((address) => ({ address })),
        bcc: bccAddresses.map((address) => ({ address })),
        html,
        attachments,
      })
      await removeDraft(api)
      navi(
        {
          pathname: location.pathname,
          search: createSearchParams({ [ID_NAME]: res.data.id }).toString(),
        },
        { replace: true, state: location.state }
      )
    } finally {
      setIsLoading(false)
    }
  }
  return {
    onSave,
    onResetSavingAtom,
    isSaving: isLoading,
  }
}
