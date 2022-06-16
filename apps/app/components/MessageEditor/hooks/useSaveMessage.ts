import { useRouter } from 'next/router'
import { atomWithReset, useResetAtom } from 'jotai/utils'
import { useAtom } from 'jotai'
import { useAPI } from '../../../hooks/useAPI'
import { useSubject } from './useSubject'
import { useAttachment } from './useAttachment'
import { ID_NAME, removeDraft } from './useSubmitMessage'

const savingMessageAtom = atomWithReset(false)

export function useSaveMessage() {
  const api = useAPI()
  const {
    subject,
    toAddresses,
    fromAddress,
    ccAddresses,
    bccAddresses,
    labels,
  } = useSubject()
  const router = useRouter()
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
        labels: {
          add: labels,
        },
        attachments,
      })
      await removeDraft(api)
      await router.replace(
        router.pathname,
        {
          query: {
            [ID_NAME]: res.data.id,
          },
        },
        {
          shallow: true,
        }
      )
    } finally {
      setIsLoading(false)
    }
  }
  return {
    onSave,
    onResetSavingAtom,
  }
}
