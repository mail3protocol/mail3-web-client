import { useRouter } from 'next/router'
import { useToast } from 'hooks'
import { atomWithReset, useResetAtom } from 'jotai/utils'
import { useAtom } from 'jotai'
import { useAPI } from '../../../hooks/useAPI'
import { useSubject } from './useSubject'
import { useAttachment } from './useAttachment'

export const DRAFT_ID_NAME = 'id'

const savingMessageAtom = atomWithReset(false)

export function useSaveMessage() {
  const api = useAPI()
  const { subject, toAddresses, fromAddress, ccAddresses, bccAddresses } =
    useSubject()
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useAtom(savingMessageAtom)
  const onResetSavingAtom = useResetAtom(savingMessageAtom)
  const { attachments } = useAttachment()
  const onSave = async (html: string) => {
    if (!fromAddress || isLoading) return
    setIsLoading(true)
    // eslint-disable-next-line compat/compat
    const draftId = new URLSearchParams(location.search).get(DRAFT_ID_NAME)
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
      if (draftId) {
        await api.deleteMessage(draftId, { force: true })
      }
      toast('Draft Saved')
      await router.replace(
        router.pathname,
        {
          query: {
            [DRAFT_ID_NAME]: res.data.id,
          },
        },
        {
          shallow: true,
        }
      )
    } catch (err) {
      toast('Draft Save Failed')
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  return {
    onSave,
    onResetSavingAtom,
  }
}
