import { atom, useAtomValue } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { ReactNode } from 'react'

export const tipsContentAtom = atom<
  JSX.Element | ReactNode | string | number | null
>(null)

export function useUpdateTipsPanel() {
  return useUpdateAtom(tipsContentAtom)
}

export function useTipsPanelContent() {
  return useAtomValue(tipsContentAtom)
}
