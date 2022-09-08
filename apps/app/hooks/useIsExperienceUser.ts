import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { userPropertiesAtom } from './useLogin'

export function useIsExperienceUser(): boolean {
  const userProperties = useAtomValue(userPropertiesAtom)
  return useMemo(() => {
    if (!userProperties || !userProperties.aliases) return false
    return (
      userProperties.aliases.length === 1 &&
      userProperties.aliases[0].email_type === 'eth_mail'
    )
  }, [userProperties])
}
