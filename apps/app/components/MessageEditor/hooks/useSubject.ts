import { atomWithReset, useResetAtom } from 'jotai/utils'
import { useAtom } from 'jotai'
import { useCallback } from 'react'

const subjectAtom = atomWithReset('')
const toAddressesAtom = atomWithReset<string[]>([])
const ccAddressesAtom = atomWithReset<string[]>([])
const bccAddressesAtom = atomWithReset<string[]>([])
const fromAddressAtom = atomWithReset<string | null>(null)
const labelsAtom = atomWithReset<string[]>([])

export function useSubject() {
  // atom 👇
  const [subject, setSubject] = useAtom(subjectAtom)
  const [toAddresses, setToAddresses] = useAtom(toAddressesAtom)
  const [ccAddresses, setCcAddresses] = useAtom(ccAddressesAtom)
  const [bccAddresses, setBccAddresses] = useAtom(bccAddressesAtom)
  const [fromAddress, setFromAddress] = useAtom(fromAddressAtom)

  // reset 👇
  const resetSubject = useResetAtom(subjectAtom)
  const resetToAddresses = useResetAtom(toAddressesAtom)
  const resetCcAddresses = useResetAtom(ccAddressesAtom)
  const resetBccAddresses = useResetAtom(bccAddressesAtom)
  const resetFromAddress = useResetAtom(fromAddressAtom)
  const resetLabels = useResetAtom(labelsAtom)

  const onReset = useCallback(() => {
    resetSubject()
    resetToAddresses()
    resetCcAddresses()
    resetBccAddresses()
    resetFromAddress()
    resetLabels()
  }, [])

  return {
    onReset,
    subject,
    setSubject,
    toAddresses,
    setToAddresses,
    ccAddresses,
    setCcAddresses,
    bccAddresses,
    setBccAddresses,
    fromAddress,
    setFromAddress,
  }
}
