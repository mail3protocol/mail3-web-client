import { RouteProps } from 'react-router-dom'
import { RoutePath } from './path'
import { Index } from '../pages'

interface ExpandedRouterProps extends RouteProps {
  key: string
  params?: string
  path: string
}

export const routes: ExpandedRouterProps[] = [
  {
    path: RoutePath.Index,
    key: 'home',
    element: <Index />,
  },
]
