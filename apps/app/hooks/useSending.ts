import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'
import { useQuery } from 'react-query'
import { Query } from '../api/query'
import { useAPI } from './useAPI'
import { Mailboxes } from '../api/mailboxes'
import { MailboxMessageItemResponse } from '../api'

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

export function useMonitorSending() {
  const api = useAPI()
  const { sendingList, completeSendingMessageById, clearSendingList } =
    useSending()
  useQuery(
    [Query.Sent],
    async () => {
      const { data } = await api.getMailboxesMessages(Mailboxes.Sent, 0)
      return {
        pages: [data],
      }
    },
    {
      enabled: sendingList.length >= 0,
      refetchInterval: 2000,
      onSuccess(data) {
        const messageMap = data.pages[0].messages.reduce<{
          [key: string]: MailboxMessageItemResponse
        }>((acc, message) => ({ ...acc, [message.messageId]: message }), {})
        sendingList
          .filter((item) => messageMap[item.messageId])
          .forEach((item) => {
            completeSendingMessageById(item.messageId)
          })
      },
      onError() {
        clearSendingList()
      },
    }
  )
  return { sendingList }
}
