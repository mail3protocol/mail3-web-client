import { atomWithReset, useResetAtom } from 'jotai/utils'
import { useAtom } from 'jotai'
import { SubmitMessage } from 'models/src/submitMessage'

export interface AttachmentExtraInfo {
  downloadProgress?: number
}

const attachmentsAtom = atomWithReset<SubmitMessage.Attachment[]>([])
const attachmentExtraInfoAtom = atomWithReset<{
  [key: string]: AttachmentExtraInfo
}>({})

export function useAttachment() {
  const [attachments, setAttachments] = useAtom(attachmentsAtom)
  const [attachmentExtraInfo, setAttachmentExtraInfo] = useAtom(
    attachmentExtraInfoAtom
  )
  const onResetAttachments = useResetAtom(attachmentsAtom)
  return {
    attachments,
    setAttachments,
    attachmentExtraInfo,
    setAttachmentExtraInfo,
    onResetAttachments,
  }
}
