import { atomWithReset, useResetAtom } from 'jotai/utils'
import { useAtom } from 'jotai'
import { SubmitMessage } from 'models/src/submitMessage'
import { useAttachment as useGenericAttachment } from '../../../hooks/useAttachment'

export interface AttachmentExtraInfo {
  downloadProgress?: number
}

export interface AttachmentExtraInfoObject {
  [key: string]: AttachmentExtraInfo
}

const attachmentsAtom = atomWithReset<SubmitMessage.Attachment[]>([])
const attachmentExtraInfoAtom = atomWithReset<AttachmentExtraInfoObject>({})

export function useAttachment() {
  const [attachments, setAttachments] = useAtom(attachmentsAtom)
  const { loadAttachments, isLoadingAttachments } =
    useGenericAttachment(setAttachments)
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
    isLoadingAttachments,
    loadAttachments,
  }
}
