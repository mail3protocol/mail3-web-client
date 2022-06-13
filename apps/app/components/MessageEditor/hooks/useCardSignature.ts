import { atomWithReset } from 'jotai/utils'
import { useAtom } from 'jotai'

const isEnableCardSignatureAtom = atomWithReset(false)

export function useCardSignature() {
  const [isEnableCardSignature, setIsEnableCardSignature] = useAtom(
    isEnableCardSignatureAtom
  )
  return {
    isEnableCardSignature,
    setIsEnableCardSignature,
  }
}
