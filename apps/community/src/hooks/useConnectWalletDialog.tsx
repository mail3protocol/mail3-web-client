import { useCallback } from 'react'
import { atom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'

export const isOpenConnectWalletDialogAtom = atom(false)

export function useOpenConnectWalletDialog() {
  const setAuthModalOpen = useUpdateAtom(isOpenConnectWalletDialogAtom)
  return useCallback(() => setAuthModalOpen(true), [setAuthModalOpen])
}

export function useCloseConnectWalletDialog() {
  const setAuthModalOpen = useUpdateAtom(isOpenConnectWalletDialogAtom)
  return useCallback(() => setAuthModalOpen(false), [setAuthModalOpen])
}
