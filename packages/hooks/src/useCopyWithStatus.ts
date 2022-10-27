import { useCallback, useState } from 'react'
import { copyText } from 'shared'

export function useCopyWithStatus() {
  const [isCopied, setIsCopied] = useState(false)
  const onCopy = useCallback(
    async (
      content: string,
      options?: {
        ms?: number
      }
    ) => {
      if (isCopied) return
      setIsCopied(true)
      await copyText(content)
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, options?.ms || 1000))
      setIsCopied(false)
    },
    [setIsCopied]
  )
  return {
    isCopied,
    onCopy,
  }
}
