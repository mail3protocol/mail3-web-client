import { Navigate } from 'react-router-dom'
import { useIsAuthenticated } from '../hooks/useLogin'
import { RoutePath } from '../route/path'

export const NotFoundPage: React.FC = () => {
  const isAuth = useIsAuthenticated()
  if (isAuth) {
    return <Navigate to={RoutePath.Dashboard} />
  }
  return <Navigate to={RoutePath.Index} />
}
