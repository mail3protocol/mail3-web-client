import { atomWithReset, useResetAtom } from 'jotai/utils'
import { useAtom } from 'jotai'
import { useAPI } from '../../../hooks/useAPI'
import { useSubject } from './useSubject'
import { useAttachment } from './useAttachment'
import { removeDraft } from './useSubmitMessage'

const savingMessageAtom = atomWithReset(false)

export function useSaveMessage() {
  const api = useAPI()
  const { subject, toAddresses, fromAddress, ccAddresses, bccAddresses } =
    useSubject()
  const [isLoading, setIsLoading] = useAtom(savingMessageAtom)
  const onResetSavingAtom = useResetAtom(savingMessageAtom)
  const { attachments } = useAttachment()
  const onSave = async (html: string) => {
    if (!fromAddress || isLoading) return
    setIsLoading(true)
    try {
      await api.uploadMessage({
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
    } finally {
      setIsLoading(false)
    }
  }
  return {
    onSave,
    onResetSavingAtom,
  }
}
