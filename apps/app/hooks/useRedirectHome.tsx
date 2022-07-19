import { useCallback } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { RoutePath } from '../route/path'
import { useIsAuthenticated } from './useLogin'

export const useRedirectHome = () => {
  const [searchParams] = useSearchParams()
  const isAuth = useIsAuthenticated()
  const redirectHome = useCallback(
    () => (
      <Navigate
        to={`${RoutePath.Testing}${
          searchParams.toString() ? `?${searchParams.toString()}` : ''
        }`}
        replace
      />
    ),
    [searchParams]
  )

  return { redirectHome, isAuth }
}
