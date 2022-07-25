import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { GetMessage } from 'models/src/getMessage'
import { SubmitMessage } from 'models/src/submitMessage'
import {
  get as getIndexedDbStorage,
  set as setIndexedDbStorage,
} from 'idb-keyval'
import { convertBlobToBase64 } from '../utils/file'
import { useAPI } from './useAPI'

export interface AttachmentExtraInfo {
  downloadProgress?: number
}

const generateAttachmentIndexedDBKey = (id: string) => `attachment:${id}`

type Attachments = SubmitMessage.Attachment[]

export enum AttachmentContentFrom {
  Api = 'api',
  IndexedDb = 'indexeddb',
}

export function useGetAttachment() {
  const api = useAPI()
  return useCallback<
    (
      messageId: string,
      attachmentId: string
    ) => Promise<{
      base64: string
      from: AttachmentContentFrom
      key: string
    }>
  >(
    async (messageId, attachmentId) => {
      const key = generateAttachmentIndexedDBKey(attachmentId)
      const readAttachmentBase64FromIndexedDb = (await getIndexedDbStorage(
        key
      )) as string | undefined
      if (!readAttachmentBase64FromIndexedDb) {
        const apiBase64 = await api
          .downloadAttachment(messageId, attachmentId)
          .then((res) =>
            convertBlobToBase64(res.data).then((b) => b.split(',')[1])
          )
          .then((base64) => {
            setIndexedDbStorage(key, base64)
            return base64
          })
        return {
          base64: apiBase64,
          from: AttachmentContentFrom.Api,
          key,
        }
      }
      return {
        base64: readAttachmentBase64FromIndexedDb,
        from: AttachmentContentFrom.IndexedDb,
        key,
      }
    },
    [api]
  )
}

export function useAttachment(
  setAttachments: Dispatch<SetStateAction<Attachments>>
) {
  const api = useAPI()
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false)
  const [attachmentExtraInfo, setAttachmentExtraInfo] = useState<{
    [key: string]: AttachmentExtraInfo
  }>({})
  const downloadOrReadCacheAttachment = useGetAttachment()

  const loadAttachments = useCallback(
    async (id: string, shouldLoadAttachments: GetMessage.Attachment[]) => {
      setIsLoadingAttachments(true)
      setAttachments(
        shouldLoadAttachments.map((a) => ({
          filename: a.filename,
          contentType: a.contentType,
          cid: a.contentId,
          content: '',
          contentDisposition: a.inline ? 'inline' : 'attachment',
        }))
      )
      setAttachmentExtraInfo(
        shouldLoadAttachments.reduce<{
          [key: string]: AttachmentExtraInfo
        }>(
          (acc, cur) => ({
            ...acc,
            [cur.contentId]: { downloadProgress: 0 },
          }),
          {}
        )
      )
      await Promise.all(
        shouldLoadAttachments.map(async (a, i) => {
          const { base64 } = await downloadOrReadCacheAttachment(id, a.id)
          setAttachmentExtraInfo((o) => ({
            ...o,
            [a.contentId]: { downloadProgress: 1 },
          }))
          setAttachments((oldStateAttachments) => {
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            oldStateAttachments[i].content = base64
            return oldStateAttachments.concat([])
          })
        })
      )
      setIsLoadingAttachments(false)
    },
    [setAttachments, api]
  )

  return {
    attachmentExtraInfo,
    setAttachmentExtraInfo,
    isLoadingAttachments,
    loadAttachments,
  }
}
