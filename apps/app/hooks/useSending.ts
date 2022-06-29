import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

export interface SendingItem {
  messageId: string
}

const SendingListAtom = atom<Array<SendingItem>>([])

export function useSending() {
  const [sendingList, setSendingList] = useAtom(SendingListAtom)
  const addSendingMessage = useCallback(
    (item: SendingItem) => {
      setSendingList((list) => list.concat([item]))
    },
    [setSendingList]
  )
  const completeSendingMessageById = useCallback(
    (messageId: string) => {
      setSendingList((list) =>
        list.filter((item) => item.messageId !== messageId)
      )
    },
    [setSendingList]
  )
  const clearSendingList = useCallback(() => {
    setSendingList([])
  }, [setSendingList])
  return {
    sendingList,
    addSendingMessage,
    completeSendingMessageById,
    clearSendingList,
  }
}
