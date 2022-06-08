import { useCallback } from 'react'
import { useCommands } from '@remirror/react'
import { useAttachment } from './useAttachment'
import { convertFileToBase64 } from '../../../utils/file'

export function useInLineImage() {
  const { insertImage } = useCommands()
  const { setAttachments } = useAttachment()
  const onUploadInLineImage = useCallback(
    async (
      file: File,
      options?: {
        cid?: string
      }
    ) => {
      const blob = await file
        .arrayBuffer()
        .then(
          (arrayBuffer) =>
            new Blob([new Uint8Array(arrayBuffer)], { type: file.type })
        )
      const blobUrl = URL.createObjectURL(blob)
      const base64 = await convertFileToBase64(file)
      setAttachments((oldAttachments) =>
        oldAttachments.concat({
          filename: file.name,
          content: base64,
          cid: options?.cid,
          contentDisposition: 'inline',
          contentType: file.type || 'text/plain',
        })
      )
      insertImage({
        src: blobUrl,
      })
    },
    []
  )
  return {
    onUploadInLineImage,
  }
}
