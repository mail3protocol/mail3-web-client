import { useCallback } from 'react'
import { downloadStringAsFile } from 'shared/src/downloadStringAsFile'
import dayjs from 'dayjs'
import { useAPI } from './useAPI'
import { DEFAULT_DOWNLOAD_LIST_ITEM_COUNT } from '../constants/env/config'

export function useDownloadSubscribers() {
  const api = useAPI()

  return useCallback(async () => {
    async function sendRequest(
      cursor?: string,
      result: string[] = []
    ): Promise<string[]> {
      const { data } = await api.getSubscribers({
        count: DEFAULT_DOWNLOAD_LIST_ITEM_COUNT,
        cursor,
      })
      const newResult = result.concat(data.subscribers)
      if (!data.next_cursor) {
        return newResult
      }
      return sendRequest(data.next_cursor, newResult)
    }
    const subscribers = (await sendRequest()).filter((s) => s)
    if (subscribers.length > 0) {
      downloadStringAsFile(
        subscribers.map((subscriber, i) => `${i + 1},${subscriber}`).join('\n'),
        `subscribers_${dayjs().format('YYYY-MM-DD')}.csv`
      )
    }
    return subscribers
  }, [api])
}
