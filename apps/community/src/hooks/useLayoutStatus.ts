import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { RoutePath } from '../route/path'

export const HiddenHeaderPathSet = new Set<string>([RoutePath.Index])
export const HiddenSidebarPathSet = new Set<string>([
  RoutePath.NewMessage,
  RoutePath.Index,
])

export function useLayoutStatus() {
  const location = useLocation()
  return useMemo(
    () => ({
      isHiddenHeader: HiddenHeaderPathSet.has(location.pathname),
      isHiddenSidebar: HiddenSidebarPathSet.has(location.pathname),
    }),
    [location.pathname]
  )
}
