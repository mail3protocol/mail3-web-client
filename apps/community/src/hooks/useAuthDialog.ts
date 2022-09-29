import { atom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { useCallback } from 'react'

export const isAuthModalOpenAtom = atom(false)

export function useOpenAuthModal() {
  const setAuthModalOpen = useUpdateAtom(isAuthModalOpenAtom)
  return useCallback(() => setAuthModalOpen(true), [setAuthModalOpen])
}

export function useCloseAuthModal() {
  const setAuthModalOpen = useUpdateAtom(isAuthModalOpenAtom)
  return useCallback(() => setAuthModalOpen(false), [setAuthModalOpen])
}
